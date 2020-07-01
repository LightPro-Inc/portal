package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ContactMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ContactMetadata(){
		this.domainName = "contacts";
		this.keyName = "id";
	}
	
	public ContactMetadata(final String domainName, final String keyName){
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

	public String locationAddressKey() {
		return "location_address";
	}
	
	public String phoneKey() {
		return "phone";
	}
	
	public String mobileKey() {
		return "mobile";
	}	
	
	public String faxKey() {
		return "fax";
	}
	
	public String mailKey() {
		return "mail";
	}
	
	public String poBoxKey() {
		return "pobox";
	}
	
	public String webSiteKey() {
		return "web_site";
	}
	
	public String emailKey() {
		return "email";
	}
	
	public String photoKey() {
		return "photo";
	}
	
	public String natureIdKey() {
		return "natureid";
	}
	
	public String companyIdKey() {
		return "companyid";
	}
	
	public String useCodeIdKey() {
		return "use_codeid";
	}
	
	public static ContactMetadata create(){
		return new ContactMetadata();
	}
}
