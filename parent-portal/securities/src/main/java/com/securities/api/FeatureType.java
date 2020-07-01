package com.securities.api;

public enum FeatureType {
	
	NONE(0, "Non d�finie"),
	FEATURE(1, "Fonctionnalit�"), 
	FEATURE_CATEGORY(2, "Cat�gorie de fonctionnalit�");
	
	private final int id;
	private final String name;
	
	FeatureType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static FeatureType get(int id){
		
		FeatureType value = FeatureType.NONE;
		for (FeatureType item : FeatureType.values()) {
			if(item.id() == id)
				value = item;
		}
		
		return value;
	}
	
	public int id(){
		return id;
	}
	
	public String toString(){
		return name;
	}
}
