package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Module;
import com.securities.api.ModuleMetadata;
import com.securities.api.Modules;

public class ModulesImpl implements Modules {

	private final transient Base base;
	private final transient ModuleMetadata dm;
	
	public ModulesImpl(Base base){
		this.base = base;
		this.dm = ModuleImpl.dm();
	}
	
	@Override
	public List<Module> availables() throws IOException {
		List<Module> values = new ArrayList<Module>();
		
		DomainsStore ds = this.base.domainsStore(dm);		
		String statement = String.format("SELECT %s FROM %s WHERE %s <> 'ADMIN' AND %s not in (SELECT %s FROM modules_installed)", dm.keyName(), dm.domainName(), dm.keyName(), dm.keyName(), dm.keyName());
		
		List<DomainStore> results = ds.findDs(statement, new ArrayList<Object>());
		for (DomainStore domainStore : results) {
			values.add(build(domainStore.key().toString())); 
		}		
		
		return values;		
	}
	
	private Module build(String id){
		return new ModuleImpl(base, id);
	}

	@Override
	public List<Module> installed() throws IOException {
		List<Module> values = new ArrayList<Module>();
		
		DomainsStore ds = this.base.domainsStore(dm);		
		String statement = String.format("SELECT %s FROM modules_installed", dm.keyName());
		
		List<DomainStore> results = ds.findDs(statement, new ArrayList<Object>());
		for (DomainStore domainStore : results) {
			values.add(build(domainStore.key().toString())); 
		}		
		
		return values;		
	}

	@Override
	public Module install(String moduleid) throws IOException {
		Module module = build(moduleid);
		module.install();
		
		return module;
	}

	@Override
	public Module uninstall(String moduleid) throws IOException {
		Module module = build(moduleid);
		module.uninstall();
		
		return module;
	}

}
