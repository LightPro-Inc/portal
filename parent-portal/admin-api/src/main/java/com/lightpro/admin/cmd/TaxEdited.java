package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TaxEdited {
	private final String name;
	private final String shortName;
	private final int rate;
	
	public TaxEdited(){
		throw new UnsupportedOperationException("#TaxEdited()");
	}
	
	@JsonCreator
	public TaxEdited( @JsonProperty("name") final String name, 
				   	  @JsonProperty("shortName") final String shortName,
				      @JsonProperty("rate") final int rate){
				
		this.name = name;
		this.shortName = shortName;
		this.rate = rate;
	}
	
	public String name(){
		return name;
	}
	
	public String shortName(){
		return shortName;
	}
	
	public int rate(){
		return rate;
	}
}
