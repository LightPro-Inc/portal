package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class UserIndicatorMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public UserIndicatorMetadata(){
		this.domainName = "user_indicators";
		this.keyName = "id";
	}
	
	public UserIndicatorMetadata(final String domainName, final String keyName){
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

	public String userIdKey(){
		return "userid";
	}
	
	public String orderKey(){
		return "order_num";
	}
	
	public String indicatorIdKey(){
		return "indicatorid";
	}
	
	public static UserIndicatorMetadata create(){
		return new UserIndicatorMetadata();
	}
}
