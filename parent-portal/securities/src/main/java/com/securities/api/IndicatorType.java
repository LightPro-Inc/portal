package com.securities.api;

public enum IndicatorType {
	
	NONE               (0, "Non d�fini", ModuleType.NONE),
	STOCK_ALERT        (1, "Stocks niveaux d'alerte", ModuleType.STOCKS),
	SALES_RESUME_SALES (100, "R�sum� des ventes globales", ModuleType.SALES),
	SALES_DETAILS_SALES (101, "R�partition des ventes", ModuleType.SALES),
	SALES_RESUME_PDV   (200, "R�sum� des ventes - points de vente", ModuleType.PDV),
	OCCUPATION_RATE    (300, "Taux d'occupation des chambres", ModuleType.HOTEL),
	ROOM_AVAILABILITY  (400, "Disponibilit� des chambres", ModuleType.HOTEL),
	DIRTY_ROOM         (500, "Chambres sales", ModuleType.HOTEL),
	DAY_OCCUPATION     (600, "Occupation journali�re", ModuleType.HOTEL),
	NUMBER_OF_CONTACTS (700, "Nombre de contacts", ModuleType.ADMIN),
	JOURNALS           (800, "Journaux comptables", ModuleType.COMPTA);
	
	private final int id;
	private final String name;
	private final ModuleType moduleType;
	
	IndicatorType(final int id, final String name, ModuleType moduleType){
		this.id = id;
		this.name = name;
		this.moduleType = moduleType;
	}
	
	public static IndicatorType get(int id){
		
		IndicatorType value = IndicatorType.NONE;
		for (IndicatorType item : IndicatorType.values()) {
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
	
	public ModuleType moduleType(){
		return moduleType;
	}	
}
