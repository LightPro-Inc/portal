package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Module;
import com.securities.api.ModuleInstalledMetadata;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;
import com.securities.api.Modules;

public class ModulesImpl implements Modules {

	private final transient Base base;
	private final transient ModuleInstalledMetadata dmInst;
	private final transient ModuleSubscribedMetadata dmSub;
	private final transient Company company;
	
	public ModulesImpl(final Base base, final Company company){
		this.base = base;
		this.company = company;
		this.dmInst = ModuleInstalledMetadata.create();
		this.dmSub = ModuleSubscribedMetadata.create();
	}
	
	@Override
	public List<Module> availables() throws IOException {
		List<Module> items = new ArrayList<Module>();
		
		for (Module module : subscribed()) {
			if(!module.isInstalled())
				items.add(module);
		}
		
		return items;		
	}
	
	@Override
	public Module get(ModuleType type) throws IOException {
		for (Module module : subscribed()) {
			if(module.type() == type)
				return module;
		}
		
		throw new IllegalArgumentException(String.format("Le module %s n'est pas disponible !", type.name()));
	}

	@Override
	public List<Module> installed() throws IOException {

		List<Module> items = new ArrayList<Module>();
		
		for (Module module : subscribed()) {
			if(module.isInstalled())
				items.add(module);
		}
		
		return items;	
	}

	@Override
	public void install(Module module) throws IOException {
		
		if(module.isInstalled())
			throw new IllegalArgumentException(String.format("Le module %s est déjà installé !", module.name()));
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dmInst.activatedKey(), true);
		
		base.domainsStore(dmInst).set(module.id(), params);
		
		module.install();
	}

	@Override
	public void uninstall(Module module) throws IOException {
		
		if(!module.isInstalled())
			throw new IllegalArgumentException(String.format("Le module %s est déjà désinstallé !", module.name()));
		
		module.uninstall();
		
		String statement = String.format("DELETE FROM %s WHERE %s=?", dmInst.domainName(), dmInst.keyName());
		base.executeQuery(statement, Arrays.asList(module.id()));
	}

	@Override
	public List<Module> subscribed() throws IOException {
		
		List<Module> values = new ArrayList<Module>();			
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dmSub.keyName(), dmSub.domainName(), dmSub.companyIdKey());
		
		List<Object> params = new ArrayList<Object>();
		params.add(company.id());
		
		List<DomainStore> results = base.domainsStore(dmSub).findDs(statement, params);
		for (DomainStore domainStore : results) {			
			values.add(new BasisModule(base, UUIDConvert.fromObject(domainStore.key()))); 
		}		
		
		return values.stream()
				     .sorted(Comparator.comparing(t -> {
						try {
							return t.order();
						} catch (IOException e) {
							e.printStackTrace();
						}
						return null;						
					}))
				     .collect(Collectors.toList());		
	}	
}
