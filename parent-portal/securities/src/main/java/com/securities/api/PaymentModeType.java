package com.securities.api;

public enum PaymentModeType {
	NONE (0, "Aucun type"),
	CASH (1, "Espèces"),
	BANK (2, "Banque");
	
	private final int id;
	private final String name;
	
	PaymentModeType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static PaymentModeType get(int id){
		
		PaymentModeType value = PaymentModeType.NONE;
		for (PaymentModeType item : PaymentModeType.values()) {
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
