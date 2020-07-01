package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SequenceEdited {
	
	private final String name;
	private final String prefix;
	private final String suffix;
	private final short size;
	private final short step;
	private final long nextNumber;
	
	public SequenceEdited(){
		throw new UnsupportedOperationException("#SequenceEdited()");
	}
	
	@JsonCreator
	public SequenceEdited(@JsonProperty("name") final String name, 
					   	  @JsonProperty("prefix") final String prefix,
					      @JsonProperty("suffix") final String suffix,
					      @JsonProperty("size") final short size,
					      @JsonProperty("step") final short step,
					      @JsonProperty("nextNumber") final long nextNumber){
				
		this.name = name;
		this.prefix = prefix;
		this.suffix = suffix;
		this.size = size;
		this.step = step;
		this.nextNumber = nextNumber;
	}
	
	public String name(){
		return name;
	}
	
	public String prefix(){
		return prefix;
	}
	
	public String suffix(){
		return suffix;
	}
	
	public short size(){
		return size;
	}
	
	public short step(){
		return step;
	}
	
	public long nextNumber(){
		return nextNumber;
	}
}
