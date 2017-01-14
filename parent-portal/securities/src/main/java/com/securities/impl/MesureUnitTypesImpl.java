package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.securities.api.MesureUnitType;
import com.securities.api.MesureUnitTypes;

public class MesureUnitTypesImpl implements MesureUnitTypes {
	
	public MesureUnitTypesImpl(){
		
	}
	
	@Override
	public MesureUnitType get(String id) throws IOException {
		List<MesureUnitType> items = all();
		
		for (MesureUnitType lt : items) {
			
			if(lt.id().equals(id))
				return lt;
		}
		
		return null;
	}

	@Override
	public List<MesureUnitType> all() throws IOException {
		
		List<MesureUnitType> items = new ArrayList<MesureUnitType>();
		
		items.add(new MesureUnitTypeImpl(MesureUnitTypeImpl.QUANTITY, "Quantité"));
		items.add(new MesureUnitTypeImpl(MesureUnitTypeImpl.TIME   	, "Temps"));		
		
		return items;
	}
}
