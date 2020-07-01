package com.securities.api;

public enum ModuleStatus {

	NONE       (0, "Non défini"),
	ACTIVATED  (1, "Activé"),
	UNACTIVATED(2, "Désactivé");
	
	private final int id;
	private final String name;
	
	ModuleStatus(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static ModuleStatus get(int id){
		
		ModuleStatus value = ModuleStatus.NONE;
		for (ModuleStatus item : ModuleStatus.values()) {
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
