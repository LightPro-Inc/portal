package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.MesureUnit;

public class MesureUnitVm {
	
	private final transient MesureUnit origin;
	
	public MesureUnitVm(){
		throw new UnsupportedOperationException("#MesureUnitVm()");
	}
	
	public MesureUnitVm(final MesureUnit origin) {
        this.origin = origin;
    }
	
	@JsonGetter
	public UUID getId(){
		return origin.id();
	}
	
	@JsonGetter
	public String getShortName() throws IOException {
		return origin.shortName();
	}
	
	@JsonGetter
	public String getFullName() throws IOException {
		return origin.fullName();
	}
	
	@JsonGetter
	public String getTypeId() throws IOException {
		return origin.type().id();
	}
	
	@JsonGetter
	public String getType() throws IOException {
		return origin.type().name();
	}
}
