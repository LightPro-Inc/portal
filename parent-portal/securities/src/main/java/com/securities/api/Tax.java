package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface Tax extends Nonable {
	UUID id();
	TaxType type() throws IOException;
	String name() throws IOException;	
	String shortName() throws IOException;
	double value() throws IOException;
	double decimalValue() throws IOException;
	NumberValueType valueType() throws IOException;
	String valueToString();
	String toString();
	Company company() throws IOException;
	
	void update(TaxType type, String name, String shortName, double value, NumberValueType valueType) throws IOException;
	double evaluateAmount(double amountHt) throws IOException;
}
