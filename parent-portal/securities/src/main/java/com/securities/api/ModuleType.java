package com.securities.api;

public enum ModuleType {
	NONE   (0, "Non d�fini", "", "", 0),
	COMPTA (1, "Comptabilit�", "compta", "G�rer votre comptabilit�.", 50),
	SB     (2, "Suivi budg�taire", "sb", "Suivre votre budget.", 60),
	STOCKS (3, "Stocks", "stocks", "G�rer les stocks de vos articles.", 10),
	PDV    (4, "Point de vente", "pdv", "Interface de vente pour boutiques.", 30),
	SALES  (5, "Ventes", "sales", "G�rer vos ventes.", 20),
	HOTEL  (6, "H�tel", "hotel", "G�rer les r�servations de vos chambres.", 40);
	
	private final int id;
	private final String name;
	private final String shortName;
	private final String description;
	private final int order;
	
	ModuleType(final int id, final String name, final String shortName, String description, int order){
		this.id = id;
		this.name = name;
		this.shortName = shortName;
		this.order = order;
		this.description = description;
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
	
	public int order(){
		return order;
	}
	
	public String description(){
		return description;
	}	
	
	public String toString(){
		return name;
	}	
	
	public String shortName(){
		return shortName;
	}	
}
