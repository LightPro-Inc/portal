package com.securities.api;

public enum ContactNature {
	
	NONE(0, "Non défini"),
	PERSON(1, "Personne"), 
	SOCIETY(2, "Société");
	
	private final int id;
	private final String name;
	
	ContactNature(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static ContactNature get(int id){
		
		ContactNature value = ContactNature.NONE;
		for (ContactNature item : ContactNature.values()) {
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
