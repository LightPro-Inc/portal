package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface Module extends Nonable {	
	
	UUID id();
	int order() throws IOException;
	String name() throws IOException;
	String shortName() throws IOException;
	String description() throws IOException;
	Company company() throws IOException;	
	boolean isSubscribed();
	boolean isActive();
	boolean isInstalled();	
	ModuleType type() throws IOException;
	
	Module subscribe() throws IOException;
	Module unsubscribe() throws IOException;
	Module install() throws IOException;
	Module uninstall() throws IOException;
	void activate(boolean active) throws IOException;
	
	FeatureSubscribed subscribeTo(Feature feature) throws IOException;
	void unsubscribeTo(Feature feature) throws IOException;
	
	Features featuresProposed() throws IOException;
	Features featuresSubscribed() throws IOException;
	Features featuresAvailable() throws IOException;
	
	Indicators indicators() throws IOException;
	Log log() throws IOException;
}
