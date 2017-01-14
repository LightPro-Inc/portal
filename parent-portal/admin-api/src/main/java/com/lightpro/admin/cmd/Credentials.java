package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Credentials {

	private final String username;
	private final String password;
	
	public Credentials(){
		throw new UnsupportedOperationException("#Credentials()");
	}
	
	public Credentials(@JsonProperty("username") final String username, 
					   @JsonProperty("password") final String password){
		this.username = username;
		this.password = password;
	}
	
	public String username(){
		return username;
	}
	
	public String password(){
		return password;
	}
}
