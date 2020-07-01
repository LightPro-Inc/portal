package com.securities.api;

public enum ModuleState {

	PROPOSED                  (1, "Propos�"),
	SUBSCRIBED                (2, "Souscrit"),
	SUBSCRIBED_NOT_INSTALLED  (3, "Souscrit non install�"),
	INSTALLED                 (4, "Install�");
	
	private final int id;
	private final String name;
	
	ModuleState(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static ModuleState get(int id){
		
		ModuleState value = ModuleState.PROPOSED;
		for (ModuleState item : ModuleState.values()) {
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
