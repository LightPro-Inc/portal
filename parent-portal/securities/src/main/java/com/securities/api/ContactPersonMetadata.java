package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ContactPersonMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ContactPersonMetadata(){
		this.domainName = "contact_persons";
		this.keyName = "id";
	}
	
	public ContactPersonMetadata(final String domainName, final String keyName){
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
	
	public String showFullnameModeIdKey() {
		return "show_fullname_modeid";
	}	
	
	public String birthDateKey() {
		return "birthdate";
	}
	
	public String birthPlaceKey() {
		return "birthplace";
	}
	
	public String sexIdKey() {
		return "sexid";
	}
	
	public String posteOccupeKey() {
		return "poste_occupe";
	}
	
	public String societyIdKey() {
		return "societyid";
	}
	
	public static ContactPersonMetadata create(){
		return new ContactPersonMetadata();
	}
}
