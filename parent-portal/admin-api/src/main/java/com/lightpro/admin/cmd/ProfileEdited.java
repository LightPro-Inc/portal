package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ProfileEdited {
	
	private final String name;
	
	public ProfileEdited(){
		throw new UnsupportedOperationException("#ProfileEdited()");
	}
	
	@JsonCreator
	public ProfileEdited(@JsonProperty("name") final String name){
				
		this.name = name;
	}
	
	public String name(){
		return name;
	}
}
