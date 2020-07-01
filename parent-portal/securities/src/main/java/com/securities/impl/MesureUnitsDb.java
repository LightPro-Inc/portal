package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitMetadata;
import com.securities.api.MesureUnitType;
import com.securities.api.MesureUnits;

public final class MesureUnitsDb extends AdvancedQueryableDb<MesureUnit, UUID, MesureUnitMetadata> implements MesureUnits {

	private final transient Company company;
	private final transient MesureUnitType type;
	public MesureUnitsDb(final Base base, final Company company, MesureUnitType type){
		super(base, "Unité de mesure introuvable !");
		this.company = company;
		this.type = type;
	}

	@Override
	public MesureUnit add(String shortName, String fullName, MesureUnitType type) throws IOException {
		return add(UUID.randomUUID(), shortName, fullName, type);			
	}

	@Override
	public MesureUnit getArticleUnit() throws IOException {
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.shortNameKey(), dm.companyIdKey());
		
		List<Object> values = ds.find(statement, Arrays.asList("Art.", company.id()));
		if(values.isEmpty()) {
			return add("Art.", "Article", MesureUnitType.QUANTITY);
		}
		
		return get(UUIDConvert.fromObject(values.get(0)));
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
	
		String statement = String.format("%s mu "
				+ "WHERE (mu.%s ILIKE ? OR mu.%s ILIKE ?) AND mu.%s=?", 
				dm.domainName(), 
				dm.shortNameKey(), dm.fullNameKey(), dm.companyIdKey());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company.id());
		
		if(type != MesureUnitType.NONE){
			statement = String.format("%s AND mu.%s=?", statement, dm.typeIdKey());
			params.add(type.id());
		}
		
		String orderClause;	
		HorodateMetadata hm = HorodateMetadata.create();
		
		orderClause = String.format("ORDER BY mu.%s DESC", hm.dateCreatedKey());
				
		String keyResult = String.format("mu.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected MesureUnit newOne(UUID id) {
		return new MesureUnitDb(base, id);
	}

	@Override
	public MesureUnit none() {
		return new MesureUnitNone();
	}

	@Override
	public MesureUnits of(MesureUnitType type) throws IOException {
		return new MesureUnitsDb(base, company, type);
	}

	@Override
	public MesureUnit add(UUID id, String shortName, String fullName, MesureUnitType type) throws IOException {
		
		if (shortName == null || shortName.isEmpty()) {
            throw new IllegalArgumentException("Invalid shortName : it can't be empty!");
        }
		
		if (fullName == null || fullName.isEmpty()) {
            throw new IllegalArgumentException("Invalid fullname : it can't be empty!");
        }
		
		if (type == MesureUnitType.NONE) {
            throw new IllegalArgumentException("Vous devez renseigner le type d'unité!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.shortNameKey(), shortName);
		params.put(dm.fullNameKey(), fullName);
		params.put(dm.typeIdKey(), type.id());
		params.put(dm.companyIdKey(), company.id());
		
		ds.set(id, params);
		
		return build(id);
	}
}
