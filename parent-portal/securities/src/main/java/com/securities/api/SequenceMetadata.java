package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class SequenceMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public SequenceMetadata(){
		this.domainName = "sequences";
		this.keyName = "id";
	}
	
	public SequenceMetadata(final String domainName, final String keyName){
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
	
	public String prefixKey() {
		return "prefix";
	}
	
	public String suffixKey() {
		return "suffix";
	}
	
	public String sizeKey() {
		return "size";
	}	
	
	public String nextNumberKey() {
		return "nextnumber";
	}	
	
	public String stepKey() {
		return "step";
	}	
	
	public String codeIdKey() {
		return "codeid";
	}
	
	public String companyIdKey() {
		return "companyid";
	}	
	
	public static SequenceMetadata create(){
		return new SequenceMetadata();
	}
}
