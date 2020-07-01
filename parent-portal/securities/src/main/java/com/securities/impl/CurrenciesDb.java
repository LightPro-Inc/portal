package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Currencies;
import com.securities.api.Currency;
import com.securities.api.CurrencyMetadata;

public final class CurrenciesDb extends AdvancedQueryableDb<Currency, String, CurrencyMetadata> implements Currencies {

	private final Company company;
	
	public CurrenciesDb(Base base, Company company) {
		super(base, "Devise introuvable !");
		this.company = company;
	}

	@Override
	public Currency add(String id, String name, String symbol, int precision, boolean after) throws IOException {
		
		if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Vous devez renseigner le code de la devise !");
        }
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Vous devez renseigner le nom de la devise !");
        }
		
		if (StringUtils.isBlank(symbol)) {
            throw new IllegalArgumentException("Vous devez renseigner le symbole de la devise !");
        }
		
		boolean exists;
		try {
			company.currencies().get(id);	
			exists = true;
		} catch (IllegalArgumentException ignore) { exists = false;}
		
		if(exists)
			throw new IllegalArgumentException("Ce code a déjà été utilisé !");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.symbolKey(), symbol);
		params.put(dm.precisionKey(), precision);
		params.put(dm.afterKey(), after);
		
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
	
		String statement = String.format("%s cu "
				+ "WHERE (cu.%s ILIKE ? OR cu.%s ILIKE ? OR cu.%s ILIKE ?)", 
				dm.domainName(), 
				dm.nameKey(), dm.keyName(), dm.symbolKey());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		
		String orderClause;	
		
		orderClause = String.format("ORDER BY cu.%s ASC", dm.nameKey());
				
		String keyResult = String.format("cu.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected Currency newOne(String id) {
		return new CurrencyDb(base, id);
	}

	@Override
	public Currency none() {
		return new CurrencyNone();
	}

	@Override
	protected String convertKey(Object id) {
		return id == null ? null : id.toString();
	}
}
