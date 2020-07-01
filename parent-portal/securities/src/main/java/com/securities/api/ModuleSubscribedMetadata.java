package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ModuleSubscribedMetadata implements DomainMetadata {
	private final transient String domainName;
	private final transient String keyName;
	
	public ModuleSubscribedMetadata(){
		this.domainName = "module_subscribed";
		this.keyName = "id";
	}
	
	public ModuleSubscribedMetadata(final String domainName, final String keyName){
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

	public String typeIdKey() {
		return "typeid";
	}
	
	public String companyIdKey() {
		return "companyid";
	}
	
	public String activatedKey() {
		return "activated";
	}
	
	public static ModuleSubscribedMetadata create(){
		return new ModuleSubscribedMetadata();
	}
}
