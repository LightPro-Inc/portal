package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Sequence;

public class SequenceVm {
	
	private final transient Sequence origin;
	
	public SequenceVm(){
		throw new UnsupportedOperationException("#SequenceVm()");
	}
		
	public SequenceVm(Sequence origin){
		this.origin = origin;
	}
	
	public UUID getId(){
		return this.origin.id();
	}
	
	public String getName() throws IOException {
		return this.origin.name();
	}
	
	public String getPrefix() throws IOException {
		return this.origin.prefix();
	}
	
	public String getSuffix() throws IOException {
		return this.origin.suffix();
	}
	
	public int getSize() throws IOException {
		return this.origin.size();
	}
	
	public int getStep() throws IOException {
		return this.origin.step();
	}
	
	public long getNextNumber() throws IOException {
		return this.origin.nextNumber();
	}
}
