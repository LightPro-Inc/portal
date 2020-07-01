package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.MesureUnit;

public final class MesureUnitVm {
	
	public final UUID id;
	public final String shortName;
	public final String fullName;
	public final int typeId;
	public final String type;
	
	public MesureUnitVm(){
		throw new UnsupportedOperationException("#MesureUnitVm()");
	}
	
	public MesureUnitVm(final MesureUnit origin) {
		try {
			this.id = origin.id();
			this.shortName = origin.shortName();
	        this.fullName = origin.fullName();
	        this.typeId = origin.type().id();
	        this.type = origin.type().toString();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
    }
}
