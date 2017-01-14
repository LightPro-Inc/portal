package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class TaxMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public TaxMetadata(){
		this.domainName = "taxes";
		this.keyName = "id";
	}
	
	public TaxMetadata(final String domainName, final String keyName){
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
	
	public String shortNameKey() {
		return "shortname";
	}
	
	public String rateKey() {
		return "rate";
	}	
}
