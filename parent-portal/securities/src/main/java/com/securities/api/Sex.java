package com.securities.api;

public enum Sex {
	
	NONE(0, "Non défini"),
	M(1, "Masculin"), 
	F(2, "Féminin");
	
	private final int id;
	private final String name;
	
	Sex(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static Sex get(int id){
		
		Sex value = Sex.NONE;
		for (Sex item : Sex.values()) {
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
