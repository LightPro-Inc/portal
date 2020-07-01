package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.AdvancedQueryable;

/*
 * fonctionnalités d'un module
 * 
 */

public interface Features extends AdvancedQueryable<Feature, String> {
	
	Features of(ModuleType moduleType) throws IOException;
	Features of(Module module) throws IOException;
	Features of(Feature category) throws IOException;
	Features of(FeatureType type) throws IOException;
	Features of(Profile profile) throws IOException;
	Features of(FeatureState state) throws IOException;
	
	FeatureSubscribed addToModule(Feature item) throws IOException;
	void removeFromModule(Feature item) throws IOException;
	
	ProfileFeature addToProfile(Feature item) throws IOException;
	void removeFromProfile(Feature item) throws IOException;
	
	void deleteAll() throws IOException;
}
