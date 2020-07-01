package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.NumberValueType;
import com.securities.api.Tax;
import com.securities.api.TaxMetadata;
import com.securities.api.TaxType;
import com.securities.api.Taxes;

public final class TaxesDb extends AdvancedQueryableDb<Tax, UUID, TaxMetadata> implements Taxes {

	private final transient Company company;
	
	public TaxesDb(final Base base, final Company company){
		super(base, "Taxe introuvable !");
		this.company = company;
	}

	@Override
	public Tax add(TaxType type, String name, String shortName, double value, NumberValueType valueType) throws IOException {
		
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
				
		if(ds.exists(dm.shortNameKey(), shortName, dm.companyIdKey(), company.id()))
			throw new IllegalArgumentException("Ce nom court est déjà utilisé !");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.valueKey(), value);
		params.put(dm.valueTypeKey(), valueType.id());
		params.put(dm.companyIdKey(), company.id());
		params.put(dm.typeIdKey(), type.id());
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	public List<Tax> getVatTaxes() throws IOException {
		List<Tax> taxes = new ArrayList<Tax>();
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.typeIdKey(), dm.companyIdKey());
		
		List<Object> values = ds.find(statement, Arrays.asList(TaxType.TVA_GROUP.id(), company.id()));
		if(values.isEmpty()) {
			taxes.add(add(TaxType.TVA_GROUP, "Taxe sur la Valeur Ajoutée", "TVA", 18, NumberValueType.PERCENT));
		}else{
			taxes = values.stream()
					      .map(m -> build(UUIDConvert.fromObject(m)))
					      .collect(Collectors.toList());
		}
		
		return taxes;
	}
	
	@Override
	public String toString() {
		try {
			return new TaxListFormatter(all()).toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s tax "
				+ "WHERE tax.%s ILIKE ? AND tax.%s=?",
				dm.domainName(), 
				dm.nameKey(), dm.companyIdKey());
		
		params.add("%" + filter + "%");
		params.add(company.id());
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String orderClause = String.format("ORDER BY tax.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("tax.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected Tax newOne(UUID id) {
		return new TaxDb(base, id);
	}

	@Override
	public Tax none() {
		return new TaxNone();
	}
}
