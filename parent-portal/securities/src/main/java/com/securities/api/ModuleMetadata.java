package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ModuleMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ModuleMetadata(){
		this.domainName = "modules";
		this.keyName = "id";
	}
	
	public ModuleMetadata(final String domainName, final String keyName){
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
	
	public String descriptionKey() {
		return "description";
	}
	
	public String urlKey() {
		return "url";
	}	
}
