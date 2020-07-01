package com.lightpro.admin.cmd;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserRegistration {
	
	private final UUID id;
	private final String username;
	private final UUID profileId;
	
	public UserRegistration(){
		throw new UnsupportedOperationException("#CustomerEdited()");
	}
	
	@JsonCreator
	public UserRegistration(@JsonProperty("id") final UUID id,						  
				    	  @JsonProperty("username") final String username,
				    	  @JsonProperty("profileId") final UUID profileId){
		
		this.id = id;
		this.username = username;
		this.profileId = profileId;
	}
	
	public UUID id(){
		return id;
	}
	
	public String username(){
		return username;
	}
	
	public UUID profileId(){
		return profileId;
	}
}
