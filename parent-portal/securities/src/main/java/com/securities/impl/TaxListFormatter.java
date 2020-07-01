package com.securities.impl;

import java.util.List;

import com.infrastructure.core.Formatter;
import com.securities.api.Tax;

public final class TaxListFormatter implements Formatter {
	
	private final transient List<Tax> taxes;
	
	public TaxListFormatter(List<Tax> taxes){
		this.taxes = taxes;
	}
	
	public String toString(){
		String description = "";
		
		for (Tax tax : taxes) {
			if(!description.isEmpty())
				description += ", ";
			
			description += String.format("%s", tax);
		}
		
		return description;
	}
}
