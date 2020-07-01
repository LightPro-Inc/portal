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

import com.infrastructure.core.QueryableDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Indicator;
import com.securities.api.IndicatorMetadata;
import com.securities.api.UserIndicatorMetadata;
import com.securities.api.Indicators;
import com.securities.api.ModuleType;
import com.securities.api.User;

public final class IndicatorsDb extends QueryableDb<Indicator, Integer, IndicatorMetadata> implements Indicators {

	private transient final ModuleType moduleType;
	private transient final User user;
	
	public IndicatorsDb(final Base base, final ModuleType moduleType, final User user) {
		super(base, "Indicateur introuvable !");
		this.moduleType = moduleType;
		this.user = user;
	}

	private QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s ind "
				+ "{statement-user} "
				+ "WHERE ind.%s ILIKE ?",
				dm.domainName(), 
				dm.nameKey());
		
		params.add("%" + filter + "%");
		
		if(moduleType != ModuleType.NONE){
			statement = String.format("%s AND ind.%s=?", statement, dm.moduleTypeIdKey());
			params.add(moduleType.id());
		}
		
		if(!user.isNone()){
			UserIndicatorMetadata userIndDm = UserIndicatorMetadata.create();
			statement = statement.replace("{statement-user}", String.format("JOIN %s userind ON userind.%s=ind.%s", userIndDm.domainName(), userIndDm.indicatorIdKey(), dm.keyName()));
			statement = String.format("%s AND userind.%s=?", statement, userIndDm.userIdKey());
			params.add(user.id());
		}else{
			statement = statement.replace("{statement-user}", "");
		}
		
		String orderClause = String.format("ORDER BY ind.%s ASC", dm.orderKey());
		
		String keyResult = String.format("ind.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	
	@Override
	public List<Indicator> all() throws IOException {
		return buildQuery(StringUtils.EMPTY).find()
										  .stream()
										  .map(m -> build(Integer.parseInt(m.toString())))
										  .collect(Collectors.toList());
	}

	@Override
	public void add(Indicator item) throws IOException {
		
		if(item.isNone())
			throw new IllegalArgumentException(msgNotFound);
		
		if(user.isNone())
			throw new IllegalArgumentException("Vous devez spécifier un utilisateur !");
		
		if(of(item.moduleType()).contains(item))
			return;
		
		UserIndicatorMetadata userIndDm = UserIndicatorMetadata.create();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(userIndDm.userIdKey(), user.id());
		params.put(userIndDm.orderKey(), user.indicators().count() + 1);
		params.put(userIndDm.indicatorIdKey(), item.id());
		
		UUID id = UUID.randomUUID();
		base.domainsStore(userIndDm).set(id, params);		
	}

	@Override
	public void delete(Indicator item) throws IOException {
	
		UserIndicatorMetadata userIndDm = UserIndicatorMetadata.create();
		String statement = String.format("DELETE FROM %s WHERE %s=? AND %s=?", userIndDm.domainName(), userIndDm.indicatorIdKey(), userIndDm.userIdKey());
		
		base.executeUpdate(statement, Arrays.asList(item.id(), user.id()));
	}

	@Override
	protected Indicator newOne(Integer id) {
		return new IndicatorDb(base, id);
	}

	@Override
	public Indicator none() {
		return new IndicatorNone();
	}

	@Override
	public Indicators of(User user) throws IOException {
		return new IndicatorsDb(base, moduleType, user);
	}

	@Override
	public Indicators of(ModuleType moduleType) throws IOException {
		return new IndicatorsDb(base, moduleType, user);
	}
}
