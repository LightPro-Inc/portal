package com.lightpro.admin.vm;

import java.io.IOException;

import com.securities.api.Module;

public class ModuleVm {
	private final transient Module module;
	
	public ModuleVm(){
		throw new UnsupportedOperationException("#ModuleVm()");
	}
		
	public ModuleVm(Module module){
		this.module = module;
	}
	
	public String getId(){
		return this.module.id();
	}
	
	public String getName() throws IOException {
		return this.module.name();
	}
	
	public String getDescription() throws IOException {
		return this.module.description();
	}
	
	public String getUrl() throws IOException {
		return this.module.url();
	}
}
