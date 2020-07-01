package com.securities.api;

public enum ModuleStatus {

	NONE       (0, "Non d�fini"),
	ACTIVATED  (1, "Activ�"),
	UNACTIVATED(2, "D�sactiv�");
	
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
