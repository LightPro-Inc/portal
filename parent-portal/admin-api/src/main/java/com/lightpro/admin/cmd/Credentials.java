package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Credentials {

	private final String fullUsername;
	private final String password;
	
	public Credentials(){
		throw new UnsupportedOperationException("#Credentials()");
	}
	
	public Credentials(@JsonProperty("fullUsername") final String fullUsername, 
					   @JsonProperty("password") final String password){
		this.fullUsername = fullUsername;
		this.password = password;
	}
	
	public String fullUsername(){
		return fullUsername;
	}
	
	public String password(){
		return password;
	}
}
