package com.securities.api;

public enum ModuleType {
	
	NONE   (0, "Non défini", "Non défini"),
	COMPTA (1, "Comptabilité", "compta"),
	SB     (2, "Suivi budgétaire", "sb"),
	STOCKS (3, "Stocks", "stocks"),
	PDV    (4, "Point de vente", "pdv"),
	SALES  (5, "Ventes", "sales"),
	HOTEL  (6, "Hôtel", "hotel"),
	SAAS   (7, "Saas", "saas"),
	ADMIN  (8, "Admin", "admin"),
	PURCHASES  (9, "Achats", "purchases");
	
	private final int id;
	private final String name;
	private final String shortName;
	
	ModuleType(final int id, final String name, final String shortName){
		this.id = id;
		this.name = name;
		this.shortName = shortName;
	}
	
	public static ModuleType get(int id){
		
		ModuleType value = ModuleType.NONE;
		for (ModuleType item : ModuleType.values()) {
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
	
	public String shortName(){
		return shortName;
	}
}
