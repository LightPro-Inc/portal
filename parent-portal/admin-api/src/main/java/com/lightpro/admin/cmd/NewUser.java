package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class NewUser {
	
	private final String firstName;
	private final String lastName;
	private final String username;
	private final String password;
	
	public NewUser(){
		throw new UnsupportedOperationException("#RegisterCmd()");
	}
	
	@JsonCreator
	public NewUser(@JsonProperty("firstName") final String firstName, 
			       @JsonProperty("lastName") final String lastName, 
			       @JsonProperty("username") final String username, 
			       @JsonProperty("password") final String password){
		
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
	}
	
	public String firstName(){
		return firstName;
	}
	
	public String lastName(){
		return lastName;
	}
	
	public String username(){
		return username;
	}
	
	public String password(){
		return password;
	}
}
