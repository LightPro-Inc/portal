package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class ModuleProposedMetadata implements DomainMetadata {
	private final transient String domainName;
	private final transient String keyName;
	
	public ModuleProposedMetadata(){
		this.domainName = "module_proposed";
		this.keyName = "id";
	}
	
	public ModuleProposedMetadata(final String domainName, final String keyName){
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
	
	public String orderKey() {
		return "order";
	}
	
	public String shortnameKey() {
		return "shortname";
	}
	
	public static ModuleProposedMetadata create(){
		return new ModuleProposedMetadata();
	}
}
