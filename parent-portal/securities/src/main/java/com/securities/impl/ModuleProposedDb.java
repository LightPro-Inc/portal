package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Module;
import com.securities.api.ModuleProposed;
import com.securities.api.ModuleProposedMetadata;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;

public final class ModuleProposedDb implements ModuleProposed {

	private final transient Base base;
	private final transient ModuleType type;
	private final transient ModuleProposedMetadata dm;
	private final transient DomainStore ds;
	private final transient Company company;
	private final transient String remoteAddress;
	private final transient String remoteUsername;
	
	public ModuleProposedDb(final Base base, final ModuleType type, Company company, final String remoteAddress, final String remoteUsername) {
		this.base = base;
		this.dm = ModuleProposedMetadata.create();
		this.ds = this.base.domainsStore(dm).createDs(type.id());
		this.type = type;
		this.company = company;
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
	}	
	
	@Override
	public boolean equals(Object o){
		if(this == o)
			return true;
		
		if(!(o instanceof Module))
			return false;
		
		Module item = (Module)o;
		
		try {
			return type == item.type();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public int hashCode(){
		return Objects.hashCode(type.id());
	}
	
	@Override
	public boolean isNone(){
		return type == ModuleType.NONE;
	}

	@Override
	public Module install() throws IOException {
		throw new IllegalArgumentException("Vous devez souscrire au module avant de l'installer !");
		
	}

	@Override
	public Module uninstall() throws IOException {
		throw new IllegalArgumentException("Vous ne pouvez pas désinstaller un module non souscrit !");
	}
	
	@Override
	public boolean isSubscribed() {
		return false;
	}
	
	@Override
	public boolean isActive() {
		return false;
	}
	
	@Override
	public boolean isInstalled() {
		return false;
	}
	
	@Override
	public void activate(boolean active) throws IOException {
		throw new IllegalArgumentException("Vous ne pouvez pas activer un module non souscrit !");		
	}

	@Override
	public Module subscribe() throws IOException {
		// correspond à mettre à disposition le module à une société

		if(company.modulesSubscribed().contains(this))
			throw new IllegalArgumentException("Le module est déjà souscrit !");
		
		ModuleSubscribedMetadata subDm = ModuleSubscribedMetadata.create();
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(subDm.typeIdKey(), type().id());
		params.put(subDm.activatedKey(), true);
		params.put(subDm.companyIdKey(), company.id());
		
		UUID id = UUID.randomUUID();
		base.domainsStore(subDm).set(id, params);
		
		return ModuleSubscribedDb.create(base, type(), company, remoteAddress, remoteUsername);
	}

	@Override
	public Module unsubscribe() throws IOException {
		throw new IllegalArgumentException("Le module n'est pas souscrit !");
	}

	@Override
	public UUID id() {
		return null;
	}

	@Override
	public int order() throws IOException {
		return ds.get(dm.orderKey());
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public String shortName() throws IOException {
		return ds.get(dm.shortnameKey());
	}

	@Override
	public String description() throws IOException {
		return ds.get(dm.descriptionKey());
	}

	@Override
	public Company company() throws IOException {
		return company;
	}

	@Override
	public ModuleType type() throws IOException {
		return type;
	}

	@Override
	public FeatureSubscribed subscribeTo(Feature feature) throws IOException {
		throw new IllegalArgumentException("Vous devez d'abord souscrire au module !");
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		throw new IllegalArgumentException("Vous devez d'abord souscrire au module !");
	}

	@Override
	public Features featuresProposed() throws IOException {
		return company.features().of(type());
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		throw new IllegalArgumentException("Vous devez d'abord souscrire au module !");
	}

	@Override
	public Features featuresAvailable() throws IOException {
		return company.features().of(type());
	}

	@Override
	public Indicators indicators() throws IOException {
		return new IndicatorsDb(base, type(), new UserNone());
	}
	
	@Override
	public Log log() throws IOException {
		return company().log().ofModule(type()).ofUser(remoteUsername).withIpAddress(remoteAddress);
	}
}
