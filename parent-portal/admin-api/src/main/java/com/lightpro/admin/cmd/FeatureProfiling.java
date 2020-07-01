package com.lightpro.admin.cmd;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FeatureProfiling {
	
	private final List<String> featuresToAdd;
	private final List<String> featuresToDelete;
	
	public FeatureProfiling(){
		throw new UnsupportedOperationException("#FeatureProfiling()");
	}
	
	@JsonCreator
	public FeatureProfiling( @JsonProperty("featuresToAdd") final List<String> featuresToAdd,
						  @JsonProperty("featuresToDelete") final List<String> featuresToDelete){
		
		this.featuresToAdd = featuresToAdd;
		this.featuresToDelete = featuresToDelete;
	}
	
	public List<String> featuresToAdd(){
		return featuresToAdd;
	}
	
	public List<String> featuresToDelete(){
		return featuresToDelete;
	}
}
