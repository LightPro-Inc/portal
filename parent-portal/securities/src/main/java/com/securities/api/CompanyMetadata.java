package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class CompanyMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public CompanyMetadata(){
		this.domainName = "companies";
		this.keyName = "id";
	}
	
	public CompanyMetadata(final String domainName, final String keyName){
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

	public String denominationKey(){
		return "denomination";
	}
	
	public String rccmKey(){
		return "rccm";
	}
	
	public String nccKey(){
		return "ncc";
	}
	
	public String siegeSocialKey(){
		return "siegesocial";
	}
	
	public String bpKey(){
		return "bp";
	}

	public String telKey(){
		return "tel";
	}
	
	public String faxKey(){
		return "fax";
	}
	
	public String emailKey(){
		return "email";
	}
	
	public String webSiteKey(){
		return "website";
	}
	
	public String logoKey(){
		return "logo";
	}
	
	public String currencyIdKey(){
		return "currencyid";
	}
	
	public String shortName(){
		return "shortname";
	}
	
	public static CompanyMetadata create(){
		return new CompanyMetadata();
	}
}
