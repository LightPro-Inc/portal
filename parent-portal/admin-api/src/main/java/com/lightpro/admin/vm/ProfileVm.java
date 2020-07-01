package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Profile;

public final class ProfileVm {
	
	public final UUID id;
	public final String name;
	public final boolean isSuperAdmin;
	public final long numberOfFeatures;
	
	public ProfileVm(){
		throw new UnsupportedOperationException("#ProfileVm()");
	}
		
	public ProfileVm(Profile origin){
		try {
			this.id = origin.id();
			this.name = origin.name();
			this.isSuperAdmin = origin.isSuperAdmin();
	        this.numberOfFeatures = origin.featuresSubscribed().count();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
	}
}
