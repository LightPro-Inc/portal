package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ProfileFeatureMetadata implements DomainMetadata {
	
	private final transient String domainName;
	private final transient String keyName;
	
	public ProfileFeatureMetadata(){
		this.domainName = "profile_features";
		this.keyName = "id";
	}
	
	public ProfileFeatureMetadata(final String domainName, final String keyName){
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

	public String profileIdKey() {
		return "profileid";
	}
	
	public String featureIdKey() {
		return "featureid";
	}
	
	public static ProfileFeatureMetadata create(){
		return new ProfileFeatureMetadata();
	}
}
