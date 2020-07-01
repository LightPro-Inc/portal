package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.Formatter;
import com.securities.api.Tax;

public final class TaxValueFormatter implements Formatter {

	private final transient Tax tax;
	
	public TaxValueFormatter(Tax tax){
		
		this.tax = tax;
	}
	
	@Override
	public String toString() {
		String summary = "";
		
		try {
			switch (tax.valueType()) {
			case PERCENT:
				summary = String.format("%.2f", tax.value()) + " %";
				break;
			case AMOUNT:
				summary = tax.company().currency().toString(tax.value());
			default:
				break;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return summary;
	}

}
