package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class FeatureSubscribedMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public FeatureSubscribedMetadata(){
		this.domainName = "features_subscribed";
		this.keyName = "id";
	}
	
	public FeatureSubscribedMetadata(final String domainName, final String keyName){
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

	public String featureIdKey(){
		return "featureid";
	}
	
	public String moduleIdKey(){
		return "moduleid";
	}
	
	public static FeatureSubscribedMetadata create(){
		return new FeatureSubscribedMetadata();
	}
}
