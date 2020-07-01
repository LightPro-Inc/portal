package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ActivateModule {
	
	private final boolean used;
	
	public ActivateModule(){
		throw new UnsupportedOperationException("#ActivateModule()");
	}
	
	@JsonCreator
	public ActivateModule( @JsonProperty("used") final boolean used){				
		this.used = used;
	}
	
	public boolean isUsed(){
		return used;
	}
}
