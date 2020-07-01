package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.Nonable;

public interface Indicator extends Nonable {
	Integer id();
	String name() throws IOException;
	String shortName() throws IOException;
	String description() throws IOException;
	int order() throws IOException;
	ModuleType moduleType() throws IOException;
}
