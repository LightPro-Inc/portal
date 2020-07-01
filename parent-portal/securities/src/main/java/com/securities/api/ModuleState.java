package com.securities.api;

public enum ModuleState {

	PROPOSED                  (1, "Proposé"),
	SUBSCRIBED                (2, "Souscrit"),
	SUBSCRIBED_NOT_INSTALLED  (3, "Souscrit non installé"),
	INSTALLED                 (4, "Installé");
	
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
