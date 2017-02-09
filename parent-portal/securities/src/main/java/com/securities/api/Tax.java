package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Tax extends Recordable<UUID, Tax> {
	String name() throws IOException;	
	String shortName() throws IOException;
	int rate() throws IOException;
	Company company() throws IOException;
	
	void update(String name, String shortName, int rate) throws IOException;
	double evaluateAmount(double amountHt) throws IOException;
}
