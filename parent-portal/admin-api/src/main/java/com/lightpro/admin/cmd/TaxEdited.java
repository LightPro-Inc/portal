package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.securities.api.NumberValueType;
import com.securities.api.TaxType;

public class TaxEdited {
	private final int typeId;
	private final String name;
	private final String shortName;
	private final double value;
	private final int valueTypeId;
	
	public TaxEdited(){
		throw new UnsupportedOperationException("#TaxEdited()");
	}
	
	@JsonCreator
	public TaxEdited(@JsonProperty("typeId") final int typeId, 
			         @JsonProperty("name") final String name, 
				   	  @JsonProperty("shortName") final String shortName,
				      @JsonProperty("value") final double value,
				      @JsonProperty("valueTypeId") final int valueTypeId){
				
		this.typeId = typeId;
		this.name = name;
		this.shortName = shortName;
		this.value = value;
		this.valueTypeId = valueTypeId;
	}
	
	public String name(){
		return name;
	}
	
	public String shortName(){
		return shortName;
	}
	
	public double value(){
		return value;
	}
	
	public NumberValueType valueType(){
		return NumberValueType.get(valueTypeId);
	}
	
	public TaxType type(){
		return TaxType.get(typeId);
	}
}
