package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.Features;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;
import com.securities.api.ProfileMetadata;

public final class SuperAdminProfileDb extends GuidKeyEntityDb<Profile, ProfileMetadata> implements Profile {

	private final transient Profile origin;
	
	public SuperAdminProfileDb(final Base base, final Profile origin){
		super(base, origin.id(), "Profile super admin introuvable !");
		this.origin = origin;
		
		initialize();
	}
	
	private void initialize(){
		// attacher tous les droits	non associés au profil
	
		try {
			for (Feature feature : origin.featuresAvailable().all()) {
				origin.addFeature(feature);
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
	}
	
	/*private static UUID getId(Base base, Company company, ProfileMetadata dm){
		
		try {
			
			String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.companyIdKey(), dm.isSuperAdminKey());
			List<Object> results = base.domainsStore(dm).find(statement, Arrays.asList(company.id(), true));;
			
			UUID id;
			
			if(!results.isEmpty()) {
				id = UUIDConvert.fromObject(results.get(0));				
			} else {
				// créer le profil
				id = company.moduleAdmin().profiles().add("Super administrateur", true).id();
			}
										
			return id;
		}catch(IOException e) {
			throw new RuntimeException(e);
		}		
	}*/

	@Override
	public boolean isSuperAdmin() throws IOException {
		return true;
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
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
	public void update(String name) throws IOException {
		origin.update(name);
	}

	@Override
	public ProfileFeature addFeature(Feature item) throws IOException {
		return origin.addFeature(item);
	}

	@Override
	public void removeFeature(Feature item) throws IOException {
		origin.removeFeature(item);
	}
}
