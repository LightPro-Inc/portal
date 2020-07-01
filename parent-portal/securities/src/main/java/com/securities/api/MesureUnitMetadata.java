package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class MesureUnitMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public MesureUnitMetadata(){
		this.domainName = "mesureunits";
		this.keyName = "id";
	}
	
	public MesureUnitMetadata(final String domainName, final String keyName){
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

	public String shortNameKey(){
		return "shortname";
	}
	
	public String fullNameKey(){
		return "fullname";
	}
	
	public String typeIdKey(){
		return "typeid";
	}
	
	public String companyIdKey(){
		return "companyid";
	}
	
	public static MesureUnitMetadata create(){
		return new MesureUnitMetadata();
	}
}
