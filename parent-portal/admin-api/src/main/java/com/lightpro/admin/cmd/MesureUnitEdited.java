package com.lightpro.admin.cmd;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MesureUnitEdited {
	
	private final UUID id;
	private final String shortName;
	private final String fullName;
	private final int quantity;
	private final String typeId;
	
	public MesureUnitEdited(){
		throw new UnsupportedOperationException("#MesureUnitEdited()");
	}
	
	@JsonCreator
	public MesureUnitEdited(@JsonProperty("id") final UUID id,
						    @JsonProperty("shortName") final String shortName, 
						    @JsonProperty("fullName") final String fullName,
						    @JsonProperty("quantity") final int quantity,
						    @JsonProperty("typeId") final String typeId){
		
		this.id = id;
		this.shortName = shortName;
		this.fullName = fullName;
		this.quantity = quantity;
		this.typeId = typeId;
	}
	
	public UUID id(){
		return id;
	}
	
	public String shortName(){
		return shortName;
	}
	
	public String fullName(){
		return fullName;
	}
	
	public int quantity(){
		return quantity;
	}
	
	public String typeId(){
		return typeId;
	}
}
