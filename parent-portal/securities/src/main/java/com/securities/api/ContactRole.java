package com.securities.api;

public enum ContactRole {
	
	NONE(0, "Non défini"),
	CUSTOMER(1, "Client"), 
	SUPPLIER(2, "Fournisseur"),
	USER(3, "Utilisateur"),
	NOT_USER(4, "Non utilisateur");
	
	private final int id;
	private final String name;
	
	ContactRole(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static ContactRole get(int id){
		
		ContactRole value = ContactRole.NONE;
		for (ContactRole item : ContactRole.values()) {
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
