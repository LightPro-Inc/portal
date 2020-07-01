package com.lightpro.admin.vm;

import com.fasterxml.jackson.annotation.JsonGetter;

public final class FileVm {
	
	private final transient byte[] content;
	
	public FileVm(){
		throw new UnsupportedOperationException("#FileVm()");
	}
		
	public FileVm(byte[] content){
		this.content = content;
	}
	
	@JsonGetter
	public byte[] content(){
		return this.content;
	}
}
