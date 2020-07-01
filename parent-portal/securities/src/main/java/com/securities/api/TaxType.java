package com.securities.api;

public enum TaxType {
	NONE (0, "Non défini"),
	TVA_GROUP (1, "TVA et taxes assimilées"),
	OTHERS (2, "Autres");
	
	private final int id;
	private final String name;
	
	TaxType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static TaxType get(int id){
		
		TaxType value = TaxType.NONE;
		for (TaxType item : TaxType.values()) {
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
