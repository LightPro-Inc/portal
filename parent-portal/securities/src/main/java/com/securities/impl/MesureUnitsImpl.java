package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.Base.OrderDirection;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitMetadata;
import com.securities.api.MesureUnits;

public class MesureUnitsImpl implements MesureUnits {

	private final transient Base base;
	private final transient MesureUnitMetadata dm;
	private final transient DomainsStore ds;
	
	public MesureUnitsImpl(final Base base){
		this.base = base;
		this.dm = MesureUnitImpl.dm();
		this.ds = base.domainsStore(dm);
	}
	
	@Override
	public List<MesureUnit> items() throws IOException {
		
		List<MesureUnit> values = new ArrayList<MesureUnit>();	
		
		List<DomainStore> results = ds.getAllOrdered(HorodateImpl.dm().dateCreatedKey(), OrderDirection.DESC);
		for (DomainStore domainStore : results) {
			values.add(new MesureUnitImpl(this.base, domainStore.key())); 
		}		
		
		return values;		
	}

	@Override
	public MesureUnit add(String shortName, String fullName, String typeId) throws IOException {
		
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
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return new MesureUnitImpl(this.base, id);		
	}

	@Override
	public void delete(MesureUnit unit) throws IOException {
		ds.delete(unit.id());
	}

	@Override
	public MesureUnit get(UUID id) throws IOException {
		
		MesureUnit unit = getOrDefault(id);
		if(unit == null)
			throw new NotFoundException("L'unité de mesure n'a pas été trouvée !");
		
		return new MesureUnitImpl(this.base, id);
	}

	@Override
	public MesureUnit getOrDefault(UUID id) throws IOException {
		
		if(!ds.exists(id))
			return null;
		
		return new MesureUnitImpl(this.base, id);
	}

	@Override
	public List<MesureUnit> find(String typeId) throws IOException {		
		List<MesureUnit> items = new ArrayList<MesureUnit>();
		
		for (MesureUnit mu : items()) {
			if(mu.type().id().equals(typeId))
				items.add(mu);
		}
		
		return items;
	}
}
