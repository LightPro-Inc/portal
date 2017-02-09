package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Module;

public class ModuleVm {
	private final transient Module module;
	
	public ModuleVm(){
		throw new UnsupportedOperationException("#ModuleVm()");
	}
		
	public ModuleVm(Module module){
		this.module = module;
	}
	
	public UUID getId(){
		return this.module.id();
	}
	
	public String getName() throws IOException {
		return this.module.name();
	}
	
	public String getShortName() throws IOException {
		return this.module.shortName();
	}
	
	public String getDescription() throws IOException {
		return this.module.description();
	}
	
	public int getTypeId() throws IOException {
		return this.module.type().id();
	}
}
