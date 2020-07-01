package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitMetadata;
import com.securities.api.MesureUnitType;

public final class MesureUnitDb extends GuidKeyEntityDb<MesureUnit, MesureUnitMetadata> implements MesureUnit {
	
	public MesureUnitDb(final Base base, final UUID id){
		super(base, id, "Unité de mesure introuvable !");
	}
	
	@Override
	public String shortName() throws IOException {
		return this.ds.get(dm.shortNameKey());
	}

	@Override
	public String fullName() throws IOException {
		return this.ds.get(dm.fullNameKey());
	}

	@Override
	public void update(String shortName, String fullName, MesureUnitType type) throws IOException {
		
		if (shortName == null || shortName.isEmpty()) {
            throw new IllegalArgumentException("Invalid shortName : it can't be empty!");
        }
		
		if (fullName == null || fullName.isEmpty()) {
            throw new IllegalArgumentException("Invalid fullname : it can't be empty!");
        }
		
		if (type == MesureUnitType.NONE) {
            throw new IllegalArgumentException("Invalid type : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.fullNameKey(), fullName);
		params.put(dm.typeIdKey(), type.id());
		
		ds.set(params);		
	}

	@Override
	public MesureUnitType type() throws IOException {
		int typeId = ds.get(dm.typeIdKey());
		return MesureUnitType.get(typeId);
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = ds.get(dm.companyIdKey());
		return new CompanyDb(base, companyId);
	}
}
