package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.Features;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;

public final class ProfileNone extends EntityNone<Profile, UUID> implements Profile {

	@Override
	public String name() throws IOException {		
		return "Non identifi�";
	}

	@Override
	public boolean isSuperAdmin() throws IOException {
		return false;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public void update(String name) throws IOException {
	
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		throw new UnsupportedOperationException("Op�ration non support�e !"); 
	}

	@Override
	public Features featuresAvailable() throws IOException {
		throw new UnsupportedOperationException("Op�ration non support�e !"); 
	}

	@Override
	public ProfileFeature addFeature(Feature item) throws IOException {
		throw new UnsupportedOperationException("Op�ration non support�e !"); 
	}

	@Override
	public void removeFeature(Feature item) throws IOException {
		
	}
}
