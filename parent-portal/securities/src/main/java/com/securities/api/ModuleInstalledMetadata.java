package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ModuleInstalledMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public ModuleInstalledMetadata(){
		this.domainName = "module_installed";
		this.keyName = "id";
	}
	
	public ModuleInstalledMetadata(final String domainName, final String keyName){
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
	
	public String activatedKey() {
		return "activated";
	}	
	
	public static ModuleInstalledMetadata create(){
		return new ModuleInstalledMetadata();
	}
}
