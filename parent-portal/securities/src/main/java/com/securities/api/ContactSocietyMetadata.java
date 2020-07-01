package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ContactSocietyMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ContactSocietyMetadata(){
		this.domainName = "contact_societies";
		this.keyName = "id";
	}
	
	public ContactSocietyMetadata(final String domainName, final String keyName){
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
	
	public static ContactSocietyMetadata create(){
		return new ContactSocietyMetadata();
	}
}
