package com.securities.api;

public enum FeatureType {
	
	NONE(0, "Non définie"),
	FEATURE(1, "Fonctionnalité"), 
	FEATURE_CATEGORY(2, "Catégorie de fonctionnalité");
	
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
