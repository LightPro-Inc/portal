package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.EventLogMetadata;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Module;
import com.securities.api.ModuleInstalled;
import com.securities.api.ModuleInstalledMetadata;
import com.securities.api.ModuleSubscribed;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;
import com.securities.api.Profile;

public final class ModuleInstalledDb extends GuidKeyEntityDb<Module, ModuleInstalledMetadata> implements ModuleInstalled {

	private final transient Module origin;
	private final transient String remoteAddress;
	private final transient String remoteUsername;
	
	private ModuleInstalledDb(final Base base, final ModuleSubscribed module, final String remoteAddress, final String remoteUsername) {
		super(base, module.id(), "Module installé introuvable !");
		this.origin = module;
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
	}	
	
	public static ModuleInstalled create(Base base, UUID moduleId, String remoteAddress, String remoteUsername) {		
		try {
			ModuleSubscribedMetadata dm = ModuleSubscribedMetadata.create();
			String statement = String.format("SELECT %s, %s FROM %s WHERE %s=?", dm.typeIdKey(), dm.companyIdKey(), dm.domainName(), dm.keyName());
			
			List<Object> results = base.executeQuery(statement, Arrays.asList(moduleId));
			if(results.isEmpty())
				throw new IllegalArgumentException("Module installé introuvable !");
			
			int typeId = Integer.parseInt(results.get(0).toString());
			UUID companyId = UUIDConvert.fromObject(results.get(1));
			
			return create(base, ModuleType.get(typeId), new CompanyDb(base, companyId), remoteAddress, remoteUsername);
			
		} catch (IOException e) {
			throw new RuntimeException(e);
		}		
	}
	
	public static ModuleInstalled create(Base base, ModuleType type, Company company, String remoteAddress, String remoteUsername) throws IOException{
		return new ModuleInstalledDb
				(
					base, 
					ModuleSubscribedDb.create(base, type, company, remoteAddress, remoteUsername),
					remoteAddress,
					remoteUsername
				);
	}
	
	@Override
	public Module uninstall() throws IOException {
		
		// 1 - supprimer toutes les fonctionnalités attribuées à des profiles
		for (Profile profile : company().moduleAdmin().profiles().all()) {
			Features profileFeatures = profile.featuresSubscribed();
			for (Feature feature : profileFeatures.all()) {
				profileFeatures.removeFromProfile(feature);
			}
		}
		
		// 2 - supprimer le log du module
		EventLogMetadata logDm = EventLogMetadata.create();
		base.executeUpdate(String.format("DELETE FROM %s WHERE %s=? AND %s=?", logDm.domainName(), logDm.companyDomainKey(), logDm.moduleShortNameKey()), Arrays.asList(company().shortName(), shortName()));
		
		ModuleInstalledMetadata dm = ModuleInstalledMetadata.create();
		base.domainsStore(dm).delete(id());
		
		if(type() != ModuleType.ADMIN)
			company().moduleAdmin().log().info("Désinstallation du module %s", type());
		
		return ModuleSubscribedDb.create(base, type(), company(), remoteAddress, remoteUsername);
	}

	@Override
	public Module install() throws IOException {
		throw new IllegalArgumentException("Le module est déjà installé !");
	}
	
	@Override
	public boolean isActive() {
		try {
			return origin.isActive() && (boolean)ds.get(dm.activatedKey());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public boolean isSubscribed() {
		return true;
	}
	
	@Override
	public boolean isInstalled() {
		return true;
	}
	
	@Override
	public void activate(boolean active) throws IOException {
				
		if(active && !origin.isActive())
			throw new IllegalArgumentException("Le module a été désactivé par le gestionnaire !");
		
		ds.set(dm.activatedKey(), active);
	}

	@Override
	public Module subscribe() throws IOException {
		throw new IllegalArgumentException("Le module est déjà souscrit !");
	}

	@Override
	public Module unsubscribe() throws IOException {
		throw new IllegalArgumentException("Le module est installé ! Désinstaller le module avant de continuer.");
	}
	
	@Override
	public Company company() throws IOException {
		return origin.company();
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
		return origin.subscribeTo(feature);
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		origin.unsubscribeTo(feature);
	}

	@Override
	public Features featuresProposed() throws IOException {
		return origin.featuresProposed();
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		return origin.featuresSubscribed();
	}

	@Override
	public Features featuresAvailable() throws IOException {
		return origin.featuresAvailable();
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}

	@Override
	public Log log() throws IOException {
		return company().log().ofModule(type()).ofUser(remoteUsername).withIpAddress(remoteAddress);
	}
}
