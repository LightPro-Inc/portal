package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class PersonMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public PersonMetadata(){
		this.domainName = "persons";
		this.keyName = "id";
	}
	
	public PersonMetadata(final String domainName, final String keyName){
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

	public String firstNameKey() {
		return "firstname";
	}
	
	public String lastNameKey() {
		return "lastname";
	}
	
	public String sexKey() {
		return "sex";
	}	
	
	public String addressKey() {
		return "address";
	}
	
	public String birthDateKey() {
		return "birthdate";
	}
	
	public String tel1Key() {
		return "tel1";
	}
	
	public String tel2Key() {
		return "tel2";
	}
	
	public String emailKey() {
		return "email";
	}
	
	public String photoKey() {
		return "photo";
	}
}
