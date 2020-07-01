package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Module;
import com.securities.api.ModuleType;

public final class ModuleVm {
	
	public final UUID id;
	public final String name;
	public final String shortName;
	public final String description;
	public final int typeId;
	public final String type;
	public final boolean isActive;
	public final boolean isAdminModule;	
	
	public ModuleVm(){
		throw new UnsupportedOperationException("#ModuleVm()");
	}
		
	public ModuleVm(Module origin){
		try {
			this.id = origin.id();
			this.name = origin.name();
			this.shortName = origin.shortName();
	        this.description = origin.description();
	        this.typeId = origin.type().id();
	        this.type = origin.type().toString();
	        this.isActive = origin.isActive();
	        this.isAdminModule = origin.type() == ModuleType.ADMIN;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
	}
}
