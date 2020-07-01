package com.securities.api;

public enum PersonNaming {
	
	NONE(0, "Non défini"),
	FIRST_LAST_NAME(1, "Prénoms & Nom"), 
	LAST_FIRST_NAME(2, "Nom & Prénoms");
	
	private final int id;
	private final String name;
	
	PersonNaming(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static PersonNaming get(int id){
		
		PersonNaming value = PersonNaming.NONE;
		for (PersonNaming item : PersonNaming.values()) {
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
