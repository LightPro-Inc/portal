package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Sequence extends Recordable<UUID, Sequence> {
	
	String name() throws IOException;
	String prefix() throws IOException;
	String suffix() throws IOException;
	int size() throws IOException;
	int step() throws IOException;
	long nextNumber() throws IOException;
	String generate() throws IOException;
	SequenceReserved code() throws IOException;
	Company company() throws IOException;
	
	void update(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException;
	
	public enum SequenceReserved {
		
		USER(0, "User"),
		PURCHASE_ORDER(1, "Devis et commande"), 
		INVOICE(2, "Facture"),
		PAYMENT(3, "Paiement"),
		PDV_SESSION(4, "Pdv session");
		
		private final int id;
		private final String name;
		
		SequenceReserved(final int id, final String name){
			this.id = id;
			this.name = name;
		}
		
		public static SequenceReserved get(int id){
			
			SequenceReserved value = SequenceReserved.USER;
			for (SequenceReserved item : SequenceReserved.values()) {
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
}
