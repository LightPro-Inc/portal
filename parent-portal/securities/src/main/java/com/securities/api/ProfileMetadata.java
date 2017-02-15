package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ProfileMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ProfileMetadata(){
		this.domainName = "profiles";
		this.keyName = "id";
	}
	
	public ProfileMetadata(final String domainName, final String keyName){
		this.domainName = domainName;
		this.keyName = keyName;
	}
	
	@Override
	public String domainName() {
		return this.domainName;
	}

	@Override
	public String keyName() {
		return this.keyName;
	}

	public String nameKey() {
		return "name";
	}
	
	public String companyIdKey() {
		return "companyid";
	}	
	
	public static ProfileMetadata create(){
		return new ProfileMetadata();
	}
}
