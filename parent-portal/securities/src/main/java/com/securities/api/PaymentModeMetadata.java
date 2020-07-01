package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public final class PaymentModeMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public PaymentModeMetadata() {
		this.domainName = "payment_modes";
		this.keyName = "id";
	}
	
	public PaymentModeMetadata(final String domainName, final String keyName){
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
	
	public String nameKey(){
		return "name";
	}
	
	public String moduleIdKey(){
		return "moduleid";
	}
	
	public String typeIdKey(){
		return "typeid";
	}

	public String activeKey(){
		return "active";
	}
	
	public static PaymentModeMetadata create(){
		return new PaymentModeMetadata();
	}	
}
