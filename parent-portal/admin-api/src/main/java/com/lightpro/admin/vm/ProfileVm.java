package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Profile;

public class ProfileVm {
	
	private final transient Profile origin;
	
	public ProfileVm(){
		throw new UnsupportedOperationException("#ProfileVm()");
	}
		
	public ProfileVm(Profile origin){
		this.origin = origin;
	}
	
	public UUID getId(){
		return this.origin.id();
	}
	
	public String getName() throws IOException {
		return this.origin.name();
	}
}
