package com.securities.api;

public enum EventLogCategory {
	
	NONE(0, "Non défini"),
	APPLICATION_LOG(1, "Journal applicatif"), 
	SECURITY_LOG(2, "Journal de sécurité");
	
	private final int id;
	private final String name;
	
	EventLogCategory(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static EventLogCategory get(int id){
		
		EventLogCategory value = EventLogCategory.NONE;
		for (EventLogCategory item : EventLogCategory.values()) {
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
