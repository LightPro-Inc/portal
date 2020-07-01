package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.formular.Formular;
import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.NumberValueType;
import com.securities.api.Tax;
import com.securities.api.TaxMetadata;
import com.securities.api.TaxType;

public final class TaxDb extends GuidKeyEntityDb<Tax, TaxMetadata> implements Tax {
	
	public TaxDb(final Base base, final UUID id){
		super(base, id, "Taxe introuvable !");
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
	public double value() throws IOException {
		return ds.get(dm.valueKey());
	}

	@Override
	public void update(TaxType type, String name, String shortName, double value, NumberValueType valueType) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		if (StringUtils.isBlank(shortName)) {
            throw new IllegalArgumentException("Invalid short name : it can't be zero!");
        }
		
		if (value <= 0) {
            throw new IllegalArgumentException("Invalid value : it can't be negative or zero!");
        }
		
		if (type == TaxType.NONE) {
            throw new IllegalArgumentException("Vous devez spécifier le type de la taxe !");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.valueKey(), value);
		params.put(dm.valueTypeKey(), valueType.id());
		params.put(dm.typeIdKey(), type.id());
		
		ds.set(params);
	}

	@Override
	public double evaluateAmount(double amountHt) throws IOException {
		
		double amount = 0;
		
		switch (valueType()) {
			case PERCENT:
				Formular formular = company().currency().calculator()
									.withExpression("tax_from_ht({base}, {ttax})")
									.withParam("{base}", amountHt)
									.withParam("{ttax}", decimalValue());
				
				amount = formular.result();
				break;
			case AMOUNT:
				amount = value();
				break;
			default:
				break;
		}
		
		return amount;
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = ds.get(dm.companyIdKey());
		return new CompanyDb(base, companyId);
	}

	@Override
	public NumberValueType valueType() throws IOException {
		int typeId = ds.get(dm.valueTypeKey());
		return NumberValueType.get(typeId);
	}
	
	@Override
	public String valueToString() {
		return new TaxValueFormatter(this).toString();
	}

	@Override
	public double decimalValue() throws IOException {
		
		if(valueType() == NumberValueType.PERCENT)
			return value() / 100.0;
		else
			return value();
	}

	@Override
	public TaxType type() throws IOException {
		int typeId = ds.get(dm.typeIdKey());
		return TaxType.get(typeId);
	}
	
	@Override
	public String toString(){
		return new TaxFormatter(this).toString();
	}
}
