package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class FeatureMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public FeatureMetadata(){
		this.domainName = "features";
		this.keyName = "id";
	}
	
	public FeatureMetadata(final String domainName, final String keyName){
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
	
	public String orderKey(){
		return "order_num";
	}
	
	public String nameKey(){
		return "name";
	}
	
	public String categoryIdKey(){
		return "categoryid";
	}
	
	public String descriptionKey(){
		return "description";
	}
	
	public String moduleTypeIdKey(){
		return "moduletypeid";
	}
	
	public static FeatureMetadata create(){
		return new FeatureMetadata();
	}
}
