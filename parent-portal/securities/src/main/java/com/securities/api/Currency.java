package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.Nonable;
import com.securities.impl.AmountFormular;

public interface Currency extends Nonable {
	
	String id();
	String name() throws IOException;
	String symbol() throws IOException;
	boolean after() throws IOException;
	int precision() throws IOException;	
	
	String toString(double amount);
	double toCurrency(double amount);
	AmountFormular calculator() throws IOException;
	
	void update(String name, String symbol, int precision, boolean after) throws IOException;
}
