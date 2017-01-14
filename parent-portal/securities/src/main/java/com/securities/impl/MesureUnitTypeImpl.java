package com.securities.impl;

import java.io.IOException;

import com.securities.api.MesureUnitType;

public class MesureUnitTypeImpl implements MesureUnitType {

	public final static String  TIME = "TIME";
	public final static String QUANTITY = "QUANTITY";
	
	private final transient String id;
	private final transient String name;
	
	public MesureUnitTypeImpl(final String id, final String name) {
		this.id = id;
		this.name = name;
	}
	
	@Override
	public String id() {
		return this.id;
	}

	@Override
	public String name() throws IOException {
		return this.name;
	}

}
