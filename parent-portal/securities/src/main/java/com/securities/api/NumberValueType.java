package com.securities.api;

public enum NumberValueType {		
	PERCENT(1, "Pourcentage"),
	AMOUNT(2, "Montant");
	
	private final int id;
	private final String name;
	
	NumberValueType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static NumberValueType get(int id){
		
		NumberValueType value = NumberValueType.PERCENT;
		for (NumberValueType item : NumberValueType.values()) {
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