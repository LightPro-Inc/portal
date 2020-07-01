package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CurrencyEdited {
	
	private final String id;
	private final String name;
	private final String symbol;
	private final int precision;
	private final boolean after;
	
	public CurrencyEdited(){
		throw new UnsupportedOperationException("#CurrencyEdited()");
	}
	
	@JsonCreator
	public CurrencyEdited(@JsonProperty("id") final String id, 
					   	  @JsonProperty("name") final String name,
					      @JsonProperty("symbol") final String symbol,
					      @JsonProperty("precision") final int precision,
					      @JsonProperty("after") final boolean after){
				
		this.id = id;
		this.name = name;
		this.symbol = symbol;
		this.precision = precision;
		this.after = after;
	}
	
	public String name(){
		return name;
	}
	
	public String id(){
		return id;
	}
	
	public String symbol(){
		return symbol;
	}
	
	public int precision(){
		return precision;
	}
	
	public boolean after(){
		return after;
	}
}
