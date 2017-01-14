package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitMetadata;
import com.securities.api.MesureUnitType;

public class MesureUnitImpl implements MesureUnit {
	
	private final transient Base base;
	private final transient Object id;
	private final transient MesureUnitMetadata dm;
	private final transient DomainStore ds;
	
	public MesureUnitImpl(final Base base, final Object id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);	
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
	public UUID id() {
		return UUIDConvert.fromObject(this.id);
	}

	@Override
	public void update(String shortName, String fullName, String typeId) throws IOException {
		
		if (shortName == null || shortName.isEmpty()) {
            throw new IllegalArgumentException("Invalid shortName : it can't be empty!");
        }
		
		if (fullName == null || fullName.isEmpty()) {
            throw new IllegalArgumentException("Invalid fullname : it can't be empty!");
        }
		
		if (typeId == null || typeId.isEmpty()) {
            throw new IllegalArgumentException("Invalid type : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.fullNameKey(), fullName);
		params.put(dm.typeIdKey(), typeId);
		
		ds.set(params);		
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}
	
	public static MesureUnitMetadata dm(){
		return new MesureUnitMetadata();
	}

	@Override
	public MesureUnitType type() throws IOException {
		String typeId = ds.get(dm.typeIdKey());
		return new MesureUnitTypesImpl().get(typeId);
	}

	@Override
	public boolean isPresent() throws IOException {
		return base.domainsStore(dm).exists(id);
	}
}
