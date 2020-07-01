package com.securities.api;

public enum EventLogType {
	
	NONE         (0, "Non défini"),
	INFORMATION  (1, "Information"), 
	WARNING      (2, "Avertissement"),
	ERROR        (3, "Erreur"),
	SUCCESS_AUDIT(4, "Audit de réussite"),
	FAILURE_AUDIT(5, "Audit d'échec");
	
	private final int id;
	private final String name;
	
	EventLogType(final int id, final String name){
		this.id = id;
		this.name = name;
	}
	
	public static EventLogType get(int id){
		
		EventLogType value = EventLogType.NONE;
		for (EventLogType item : EventLogType.values()) {
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
