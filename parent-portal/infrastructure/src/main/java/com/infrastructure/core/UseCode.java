package com.infrastructure.core;

public enum UseCode {
	
	NONE   (0, "Non défini"),
	USER   (1, "Utilisateur"), 
	SYSTEM (2, "Système");
	
	private final int id;
	private final String name;
	
	UseCode(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static UseCode get(int id){
		
		UseCode value = UseCode.NONE;
		for (UseCode item : UseCode.values()) {
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
