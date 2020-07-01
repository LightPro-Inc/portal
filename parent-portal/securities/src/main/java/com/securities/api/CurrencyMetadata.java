package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class CurrencyMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public CurrencyMetadata(){
		this.domainName = "currencies";
		this.keyName = "id";
	}
	
	public CurrencyMetadata(final String domainName, final String keyName){
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
	
	public String symbolKey() {
		return "symbol";
	}
	
	public String afterKey() {
		return "after";
	}
	
	public String precisionKey() {
		return "precision";
	}
	
	public static CurrencyMetadata create(){
		return new CurrencyMetadata();
	}
}
