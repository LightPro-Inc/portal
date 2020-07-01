package com.securities.api;

public enum MesureUnitType {
	
	NONE(0, "Non défini"),
	QUANTITY(1, "Quantité"), 
	TIME(2, "Temps");
	
	private final int id;
	private final String name;
	
	MesureUnitType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static MesureUnitType get(int id){
		
		MesureUnitType value = MesureUnitType.NONE;
		for (MesureUnitType item : MesureUnitType.values()) {
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
