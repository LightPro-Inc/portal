package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Tax;
import com.securities.api.TaxMetadata;

public class TaxImpl implements Tax {

	private final transient Base base;
	private final transient Object id;
	private final transient TaxMetadata dm;
	private final transient DomainStore ds;
	
	public TaxImpl(final Base base, final Object id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);	
	}
	
	@Override
	public UUID id() {
		return UUIDConvert.fromObject(this.id);
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}

	@Override
	public boolean isPresent() throws IOException {
		return base.domainsStore(dm).exists(id);
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public String shortName() throws IOException {
		return ds.get(dm.shortNameKey());
	}

	@Override
	public int rate() throws IOException {
		return ds.get(dm.rateKey());
	}

	public static TaxMetadata dm(){
		return new TaxMetadata();	
	}

	@Override
	public void update(String name, String shortName, int rate) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		if (StringUtils.isBlank(shortName)) {
            throw new IllegalArgumentException("Invalid short name : it can't be zero!");
        }
		
		if (rate <= 0) {
            throw new IllegalArgumentException("Invalid rate : it can't be negative or zero!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.rateKey(), rate);
		
		ds.set(params);
	}

	@Override
	public double evaluateAmount(double amountHt) throws IOException {
		return amountHt * (rate() / 100.0);
	}
}
