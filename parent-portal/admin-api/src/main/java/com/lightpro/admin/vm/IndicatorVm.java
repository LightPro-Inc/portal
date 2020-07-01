package com.lightpro.admin.vm;

import java.io.IOException;

import com.securities.api.Indicator;

public final class IndicatorVm {
	
	public final int id;
	public final String shortName;
	public final String name;
	public final String description;
	public final int order;
	public final int moduleId;
	public final String module;
	public final String moduleShortName;
	
	public IndicatorVm(){
		throw new UnsupportedOperationException("#IndicatorVm()");
	}
	
	public IndicatorVm(final Indicator origin) {
		try {
			this.id = origin.id();
			this.shortName = origin.shortName();
	        this.name = origin.name();
	        this.description = origin.description();
	        this.order = origin.order();
	        this.moduleId = origin.moduleType().id();
	        this.module = origin.moduleType().name();
	        this.moduleShortName = origin.moduleType().shortName();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
    }	
}
