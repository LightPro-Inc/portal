package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Profile;
import com.securities.api.ProfileMetadata;

public class ProfileImpl implements Profile {

	private final transient Base base;
	private final transient UUID id;
	private final transient ProfileMetadata dm;
	private final transient DomainStore ds;
	
	public ProfileImpl(final Base base, final UUID id){
		this.base = base;
		this.id = id;
		this.dm = ProfileMetadata.create();
		this.ds = this.base.domainsStore(this.dm).createDs(id);	
	}
	
	@Override
	public UUID id() {
		return this.id;
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}

	@Override
	public boolean isPresent() {
		return base.domainsStore(dm).exists(id);
	}

	@Override
	public boolean isEqual(Profile item) {
		return this.id().equals(item.id());
	}

	@Override
	public boolean isNotEqual(Profile item) {
		return !isEqual(item);
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = ds.get(dm.companyIdKey());
		return new CompanyImpl(base, companyId);
	}

	@Override
	public void update(String name) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		
		ds.set(params);		
	}
}
