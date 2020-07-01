package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Admin;

public final class AdminVm {
	
	public final UUID id;
	public final String name;
	public final String shortName;
	
	public AdminVm(){
		throw new UnsupportedOperationException("#SalesVm()");
	}
	
	public AdminVm(final Admin origin) {
		try {
			this.id = origin.id();
	        this.name = origin.name();
	        this.shortName = origin.shortName();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
    }
}
