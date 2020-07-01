package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class EventLogMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public EventLogMetadata(){
		this.domainName = "event_logs";
		this.keyName = "id";
	}
	
	public EventLogMetadata(final String domainName, final String keyName){
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

	public String dateCreatedKey() {
		return "datecreated";
	}
	
	public String categoryIdKey() {
		return "categoryid";
	}
	
	public String typeIdKey() {
		return "typeid";
	}
	
	public String messageKey() {
		return "message";
	}
	
	public String detailsKey() {
		return "details";
	}
	
	public String companyNameKey() {
		return "company_name";
	}
	
	public String companyDomainKey() {
		return "company_domain";
	}
	
	public String moduleNameKey() {
		return "module_name";
	}
	
	public String moduleShortNameKey() {
		return "module_shortname";
	}
	
	public String authorLoginKey() {
		return "author_login";
	}
	
	public String authorNameKey() {
		return "author_name";
	}
	
	public String ipAddressKey() {
		return "ipaddress";
	}
	
	public static EventLogMetadata create(){
		return new EventLogMetadata();
	}
}
