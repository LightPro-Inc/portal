package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class IndicatorMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public IndicatorMetadata(){
		this.domainName = "indicators";
		this.keyName = "id";
	}
	
	public IndicatorMetadata(final String domainName, final String keyName){
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

	public String moduleTypeIdKey(){
		return "moduletypeid";
	}
	
	public String orderKey(){
		return "order_num";
	}
	
	public String nameKey(){
		return "name";
	}
	
	public String shortNameKey(){
		return "shortname";
	}
	
	public String descriptionKey(){
		return "description";
	}
	
	public static IndicatorMetadata create(){
		return new IndicatorMetadata();
	}
}
