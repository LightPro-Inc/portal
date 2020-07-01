package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureState;
import com.securities.api.Features;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;
import com.securities.api.ProfileMetadata;

public final class ProfileDb extends GuidKeyEntityDb<Profile, ProfileMetadata> implements Profile {
	
	public ProfileDb(final Base base, final UUID id){
		super(base, id, "Profil introuvable !");	
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = ds.get(dm.companyIdKey());
		return new CompanyDb(base, companyId);
	}

	@Override
	public void update(String name) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		
		ds.set(params);		
	}

	@Override
	public boolean isSuperAdmin() throws IOException {
		return ds.get(dm.isSuperAdminKey());
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		return company().features().of(this).of(FeatureState.SUBSCRIBED);
	}

	@Override
	public Features featuresAvailable() throws IOException {		
		return company().features().of(this).of(FeatureState.PROPOSED);
	}

	@Override
	public ProfileFeature addFeature(Feature item) throws IOException {
		return featuresSubscribed().addToProfile(item);
	}

	@Override
	public void removeFeature(Feature item) throws IOException {
		featuresSubscribed().removeFromProfile(item); 
	}
}
