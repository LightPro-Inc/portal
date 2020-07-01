package com.lightpro.admin.vm;

import java.io.IOException;

import com.securities.api.Feature;

public final class FeatureVm {
	
	public final String id;
	public final String name;
	public final int order;
	public final String description;
	public final int numberOfSubFeatures;
	
	public FeatureVm(){
		throw new UnsupportedOperationException("#FeatureVm()");
	}
		
	public FeatureVm(Feature origin){
		try {
			this.id = origin.id();
	        this.name = origin.name();
	        this.order = origin.order();
	        this.description = origin.description();
	        this.numberOfSubFeatures = origin.children().size();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
	}
}
