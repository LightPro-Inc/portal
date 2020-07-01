package com.securities.api;

public enum PaymentModeStatus {
	NONE (0, "Aucun état"),
	DISABLED (1, "Désactivé"),
	ENABLED (2, "Activé");
	
	private final int id;
	private final String name;
	
	PaymentModeStatus(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static PaymentModeStatus get(int id){
		
		PaymentModeStatus value = PaymentModeStatus.NONE;
		for (PaymentModeStatus item : PaymentModeStatus.values()) {
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
