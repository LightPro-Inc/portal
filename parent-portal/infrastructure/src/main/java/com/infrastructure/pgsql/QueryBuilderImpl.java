package com.infrastructure.pgsql;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.QueryBuilder;

public class QueryBuilderImpl implements QueryBuilder {

	private transient final DomainsStore ds;
	private transient final String statement;
	private transient final List<Object> params;
	private transient final String keyResult;
	private transient final String orderClause;
	
	public QueryBuilderImpl(DomainsStore ds, String statement, List<Object> params, String keyResult, String orderClause){
		this.ds = ds;
		this.statement = statement;
		this.params = params;
		this.keyResult = keyResult;
		this.orderClause = orderClause;
	}
	
	@Override
	public List<Object> find() throws IOException {
		String query = String.format("SELECT %s FROM %s", keyResult, statement);
		
		if(!StringUtils.isBlank(orderClause))
			query = String.format("%s %s", query, orderClause);
		
		return ds.find(query, params);
	}

	@Override
	public List<Object> find(int page, int pageSize) throws IOException {
		String query = String.format("SELECT %s FROM %s", keyResult, statement);
		
		if(!StringUtils.isBlank(orderClause))
			query = String.format("%s %s", query, orderClause);
		
		return ds.findPagined(query, params, page, pageSize);
	}

	@Override
	public int count() throws IOException {
		List<Object> results = ds.find(String.format("SELECT COUNT(%s) FROM %s", keyResult, statement), params);		
		return Integer.parseInt(results.get(0) == null ? "0" : results.get(0).toString());		
	}

	@Override
	public double sum(String key) throws IOException {
		List<Object> results = ds.find(String.format("SELECT sum(%s) FROM %s", key, statement), params);
		return Double.parseDouble(results.get(0) == null ? "0" : results.get(0).toString());
	}

	@Override
	public boolean exists(String key, Object value) {
		List<Object> params1 = params;
		params1.add(value);
		
		String alias = StringUtils.split(keyResult, ".")[0];
		List<Object> results;
		try {
			results = ds.find(String.format("SELECT %s FROM %s AND %s.%s=?", keyResult, statement, alias, key), params1);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}		
		
		return !results.isEmpty();
	}
}
