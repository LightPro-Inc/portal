package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureState;
import com.securities.api.FeatureSubscribed;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Module;
import com.securities.api.ModuleInstalledMetadata;
import com.securities.api.ModuleProposed;
import com.securities.api.ModuleSubscribed;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;

public final class ModuleSubscribedDb extends GuidKeyEntityDb<Module, ModuleSubscribedMetadata> implements ModuleSubscribed {
	
	private final transient Module origin;
	private final transient Company company;
	private final transient String remoteAddress;
	private final transient String remoteUsername;
	
	private ModuleSubscribedDb(final Base base, final ModuleProposed origin, final Company company, final String remoteAddress, final String remoteUsername) {
		super(base, getId(base, origin, company), "Module souscrit introuvable !");
		this.origin = origin;
		this.company = company;
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
	}
	
	public static ModuleSubscribed create(Base base, ModuleType type, Company company, String remoteAddress, String remoteUsername) throws IOException{
		return new ModuleSubscribedDb
				(
					base, 
					new ModuleProposedDb(base, type, company, remoteAddress, remoteUsername), 
					company,
					remoteAddress,
					remoteUsername
				);
	}
	
	private static UUID getId(Base base, Module module, Company company){
		ModuleSubscribedMetadata dm = ModuleSubscribedMetadata.create();
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.companyIdKey(), dm.typeIdKey());		
		
		try {
			List<Object> params = Arrays.asList(company.id(), module.type().id());
			List<Object>results = base.executeQuery(statement, params);
			
			if(results.isEmpty())
				return null;
			else
				return UUIDConvert.fromObject(results.get(0));
			
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public Module install() throws IOException {
		
		if(company.modulesInstalled().contains(this))
			throw new IllegalArgumentException("Le module est déjà installé !");
		
		ModuleInstalledMetadata dm = ModuleInstalledMetadata.create();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.activatedKey(), true);
		
		base.domainsStore(dm).set(id(), params);
		
		if(type() != ModuleType.ADMIN)
			company.moduleAdmin().log().info("Installation du module %s", type());
		else
			log().info("Installation du module %s", ModuleType.ADMIN);
		
		return ModuleInstalledDb.create(base, type(), company(), remoteAddress, remoteUsername);
	}

	@Override
	public Module uninstall() throws IOException {
		throw new IllegalArgumentException("Le module n'est pas installé !");
	}
	
	@Override
	public boolean isSubscribed() {
		return true;
	}
	
	@Override
	public boolean isActive() {
		try {
			return ds.get(dm.activatedKey());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public boolean isInstalled() {
		ModuleInstalledMetadata dm = ModuleInstalledMetadata.create();
		return base.domainsStore(dm).exists(id);
	}
	
	@Override
	public void activate(boolean active) throws IOException {
		ds.set(dm.activatedKey(), active);	
	}

	@Override
	public Module subscribe() throws IOException {
		throw new IllegalArgumentException("Le module est déjà souscrit !");
	}

	@Override
	public Module unsubscribe() throws IOException {
		
		if(company.modulesInstalled().contains(this))
			throw new IllegalArgumentException("Le module est installé ! Désinstaller le module avant de continuer l'action !");
		
		// supprimer toutes les fonctionnalités souscrites
		Features featuresSubscribed = featuresSubscribed();
		for (Feature feature : featuresSubscribed.all()) {
			featuresSubscribed.removeFromModule(feature);
		}
		
		ModuleSubscribedMetadata dm = ModuleSubscribedMetadata.create();
		base.domainsStore(dm).delete(id);
		
		return new ModuleProposedDb(base, type(), company, remoteAddress, remoteUsername);
	}

	@Override
	public int order() throws IOException {
		return origin.order();
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public String shortName() throws IOException {
		return origin.shortName();
	}

	@Override
	public String description() throws IOException {
		return origin.description();
	}

	@Override
	public ModuleType type() throws IOException {
		return origin.type();
	}

	@Override
	public FeatureSubscribed subscribeTo(Feature feature) throws IOException {
		return featuresSubscribed().addToModule(feature);
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		featuresSubscribed().removeFromModule(feature);
	}

	@Override
	public Features featuresProposed() throws IOException {
		return origin.featuresProposed();
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		return company.features().of(this).of(FeatureState.SUBSCRIBED);
	}

	@Override
	public Features featuresAvailable() throws IOException {
		return company.features().of(this).of(FeatureState.PROPOSED);
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}

	@Override
	public Company company() throws IOException {
		return company;
	}
	
	@Override
	public Log log() throws IOException {
		return company().log().ofModule(type()).ofUser(remoteUsername).withIpAddress(remoteAddress);
	}
}