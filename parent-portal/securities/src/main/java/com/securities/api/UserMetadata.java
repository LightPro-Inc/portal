package com.securities.api;

import com.infrastructure.core.DomainMetadata;

public class UserMetadata implements DomainMetadata {

	private final transient String domainName;
	private final transient String keyName;
	
	public UserMetadata(){
		this.domainName = "users";
		this.keyName = "id";
	}
	
	public UserMetadata(final String domainName, final String keyName){
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

	public String usernameKey() {
		return "username";
	}
	
	public String hashedPasswordKey() {
		return "hashedpassword";
	}
	
	public String isLockedKey() {
		return "islocked";
	}	
	
	public String saltKey() {
		return "salt";
	}	
	
	public String profileIdKey() {
		return "profileid";
	}
	
	public static UserMetadata create(){
		return new UserMetadata();
	}
}
