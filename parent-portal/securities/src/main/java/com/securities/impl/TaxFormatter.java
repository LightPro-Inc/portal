package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.Formatter;
import com.securities.api.Tax;

public final class TaxFormatter implements Formatter {

	private final transient Tax tax;
	
	public TaxFormatter(Tax tax){
		this.tax = tax;
	}
	
	@Override
	public String toString() {
		try {
			return String.format("%s (%s)", tax.shortName(), tax.valueToString());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

}
