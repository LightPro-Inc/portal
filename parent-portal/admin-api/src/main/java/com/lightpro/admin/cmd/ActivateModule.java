package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ActivateModule {
	
	private final boolean active;
	
	public ActivateModule(){
		throw new UnsupportedOperationException("#ActivateModule()");
	}
	
	@JsonCreator
	public ActivateModule( @JsonProperty("active") final boolean active){				
		this.active = active;
	}
	
	public boolean active(){
		return active;
	}
}
