package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface Profile extends Nonable {	
	UUID id();
	String name() throws IOException;
	boolean isSuperAdmin() throws IOException;	
	Company company() throws IOException;
	
	Features featuresSubscribed() throws IOException;
	Features featuresAvailable() throws IOException;
	
	void update(String name) throws IOException;
	
	ProfileFeature addFeature(Feature item) throws IOException;
	void removeFeature(Feature item) throws IOException;
}
