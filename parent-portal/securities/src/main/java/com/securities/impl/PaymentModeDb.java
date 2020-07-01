package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Admin;
import com.securities.api.PaymentMode;
import com.securities.api.PaymentModeMetadata;
import com.securities.api.PaymentModeType;

public final class PaymentModeDb extends GuidKeyEntityDb<PaymentMode, PaymentModeMetadata> implements PaymentMode {

	private final transient Admin admin;
	
	public PaymentModeDb(final Base base, final UUID id, final Admin admin) {
		super(base, id, "Mode de paiement introuvable !");
		this.admin = admin;
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public PaymentModeType type() throws IOException {
		int typeId = ds.get(dm.typeIdKey());
		return PaymentModeType.get(typeId);
	}

	@Override
	public Admin module() throws IOException {
		return admin;
	}

	@Override
	public void update(String name) throws IOException {
		
		if(StringUtils.isBlank(name))
			throw new IllegalArgumentException("Le libellé doit être renseigné !"); 
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
				
		ds.set(params);	
	}

	@Override
	public boolean active() throws IOException {
		return ds.get(dm.activeKey());
	}

	@Override
	public void enable(boolean active) throws IOException {
		ds.set(dm.activeKey(), active);
	}
}
