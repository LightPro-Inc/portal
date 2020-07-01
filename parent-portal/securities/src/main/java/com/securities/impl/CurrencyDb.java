package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.EntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Currency;
import com.securities.api.CurrencyMetadata;

public final class CurrencyDb extends EntityDb<Currency, String, CurrencyMetadata> implements Currency {

	public CurrencyDb(Base base, String id) {
		super(base, id, "Devise introuvable !");
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public String symbol() throws IOException {
		return ds.get(dm.symbolKey());
	}

	@Override
	public boolean after() throws IOException {
		return ds.get(dm.afterKey());
	}

	@Override
	public int precision() throws IOException {
		return ds.get(dm.precisionKey());
	}

	@Override
	public void update(String name, String symbol, int precision, boolean after) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Vous devez renseigner le nom de la devise !");
        }
		
		if (StringUtils.isBlank(symbol)) {
            throw new IllegalArgumentException("Vous devez renseigner le symbole de la devise !");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.symbolKey(), symbol);
		params.put(dm.precisionKey(), precision);
		params.put(dm.afterKey(), after);
	
		ds.set(params);
	}

	@Override
	protected String convertKey(Object id) {
		return id == null ? null : id.toString();
	}

	@Override
	public String toString(double amount) {
		
		try {
			if(after())
				return String.format("%s %s", amount, symbol());
			else
				return String.format("%s %s", symbol(), amount);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}			
	}

	@Override
	public double toCurrency(double amount) {
		try {
			return calculator().withExpression("{amount}").withParam("{amount}", amount).result();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public AmountFormular calculator() throws IOException {
		return new AmountFormular(precision(), this, new SimpleFormular(StringUtils.EMPTY, precision(), false));
	}
}
