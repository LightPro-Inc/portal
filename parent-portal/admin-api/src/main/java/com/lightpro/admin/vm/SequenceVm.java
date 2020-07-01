package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Sequence;

public final class SequenceVm {
	
	public final UUID id;
	public final String name;
	public final String prefix;
	public final String suffix;
	public final int size;
	public final int step;
	public final long nextNumber;
	
	public SequenceVm(){
		throw new UnsupportedOperationException("#SequenceVm()");
	}
		
	public SequenceVm(Sequence origin){
		try {
			this.id = origin.id();
			this.name = origin.name();
	        this.prefix = origin.prefix();
	        this.suffix = origin.suffix();
	        this.size = origin.size();
	        this.step = origin.step();
	        this.nextNumber = origin.nextNumber();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	
	}
}
