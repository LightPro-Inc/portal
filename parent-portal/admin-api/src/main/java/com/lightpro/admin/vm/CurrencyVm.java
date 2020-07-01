package com.lightpro.admin.vm;

import java.io.IOException;

import com.securities.api.Currency;

public final class CurrencyVm {
	
	public final String id;
	public final String name;
	public final String symbol;
	public final int precision;	
	public final boolean after;
	
	public CurrencyVm(){
		throw new UnsupportedOperationException("#CurrencyVm()");
	}
	
	public CurrencyVm(final Currency origin) {
		try {
			this.id = origin.id();
	        this.name = origin.name();
	        this.symbol = origin.symbol();
	        this.precision = origin.precision();
	        this.after = origin.after();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
    }
}
