package com.securities.api;

public enum FeatureState {
	
	PROPOSED(1, "Proposée"), 
	SUBSCRIBED(2, "Souscrite"),
	USER_SUBSCRIBED(3, "Droit utilisateur");
	
	private final int id;
	private final String name;
	
	FeatureState(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static FeatureState get(int id){
		
		FeatureState value = FeatureState.PROPOSED;
		for (FeatureState item : FeatureState.values()) {
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
