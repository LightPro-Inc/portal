package com.securities.api;

import java.io.IOException;
import java.util.List;

import com.infrastructure.core.Nonable;

public interface Feature extends Nonable {
	
	String id();
	int order() throws IOException;
	String name() throws IOException;
	Feature category() throws IOException;
	String description() throws IOException;
	ModuleType moduleType() throws IOException;	
	
	List<Feature> children() throws IOException;	
}
