package com.lightpro.admin.vm;

import java.io.IOException;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.MesureUnitType;

public class MesureUnitTypeVm {
	
	private final transient MesureUnitType origin;
	
	public MesureUnitTypeVm(){
		throw new UnsupportedOperationException("#MesureUnitTypeVm()");
	}
	
	public MesureUnitTypeVm(final MesureUnitType origin) {
        this.origin = origin;
    }
	
	@JsonGetter
	public String getId(){
		return origin.id();
	}
	
	@JsonGetter
	public String getName() throws IOException {
		return origin.name();
	}	
}
