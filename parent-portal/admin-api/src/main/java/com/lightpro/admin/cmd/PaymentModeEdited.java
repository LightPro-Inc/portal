package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.securities.api.PaymentModeType;

public class PaymentModeEdited {
	private final String name;
	private final int typeId;
	
	public PaymentModeEdited(){
		throw new UnsupportedOperationException("#PaymentModeEdited()");
	}
	
	@JsonCreator
	public PaymentModeEdited( @JsonProperty("name") final String name, 
				      @JsonProperty("typeId") final int typeId){
				
		this.name = name;
		this.typeId = typeId;
	}
	
	public String name(){
		return name;
	}
	
	public PaymentModeType type(){
		return PaymentModeType.get(typeId);
	}
}
