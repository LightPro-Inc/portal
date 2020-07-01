package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Admin;
import com.securities.api.PaymentMode;
import com.securities.api.PaymentModeMetadata;
import com.securities.api.PaymentModeStatus;
import com.securities.api.PaymentModeType;
import com.securities.api.PaymentModes;

public final class PaymentModesDb extends AdvancedQueryableDb<PaymentMode, UUID, PaymentModeMetadata> implements PaymentModes {

	private transient final Admin module;
	private transient final PaymentModeType type;
	private transient final PaymentModeStatus status;
	
	public PaymentModesDb(Base base, Admin module, PaymentModeType type, PaymentModeStatus status) {
		super(base, "Mode de paiement introuvable !");
		
		this.module = module;
		this.type = type;
		this.status = status;
	}

	@Override
	public PaymentMode add(String name, PaymentModeType type) throws IOException {

		if(StringUtils.isBlank(name)) 
			throw new IllegalArgumentException("Le libellé doit être renseigné !");		
		
		if(type == PaymentModeType.NONE)
			throw new IllegalArgumentException("Le type doit être renseigné !");
		
		Map<String, Object> params = new HashMap<String, Object>();	
		params.put(dm.nameKey(), name);
		params.put(dm.activeKey(), true);
		params.put(dm.typeIdKey(), type.id());
		params.put(dm.moduleIdKey(), module.id());
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s pm "				
				+ "WHERE pm.%s ILIKE ? AND pm.%s=?",				 
				dm.domainName(), 
				dm.nameKey(), dm.moduleIdKey());
		
		params.add("%" + filter + "%");
		params.add(module.id());
		
		if(type != PaymentModeType.NONE){
			statement = String.format("%s AND pm.%s=?", statement, dm.typeIdKey());
			params.add(type.id());
		}
		
		if(status == PaymentModeStatus.ENABLED){
			statement = String.format("%s AND pm.%s IS TRUE", statement, dm.activeKey());
		}
		
		if(status == PaymentModeStatus.DISABLED){
			statement = String.format("%s AND pm.%s IS FALSE", statement, dm.activeKey());
		}
		
		String orderClause = String.format("ORDER BY pm.%s ASC, pm.%s ASC", dm.typeIdKey(), dm.nameKey());
		
		String keyResult = String.format("pm.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected PaymentMode newOne(UUID id) {
		return new PaymentModeDb(base, id, module);
	}

	@Override
	public PaymentMode none() {
		return new PaymentModeNone();
	}

	@Override
	public PaymentModes of(PaymentModeType type) throws IOException {
		return new PaymentModesDb(base, module, type, status);
	}

	@Override
	public PaymentModes of(PaymentModeStatus status) throws IOException {
		return new PaymentModesDb(base, module, type, status);
	}
}
