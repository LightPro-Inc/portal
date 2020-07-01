package com.infrastructure.datasource;

import java.io.IOException;
import java.util.List;

import com.infrastructure.core.DomainMetadata;

public interface Base {
	
	void commit();
	void rollback();
	void terminate();
	
	DomainsStore domainsStore(DomainMetadata dm);	
	List<Object> executeQuery(String query, List<Object> params) throws IOException;
	void executeUpdate(String query, List<Object> params) throws IOException;
	void deleteAll(DomainMetadata dm) throws IOException;
	QueryBuilder createQueryBuilder(DomainsStore ds, String statement, List<Object> params, String orderClause) throws IOException;
	QueryBuilder createQueryBuilder(DomainsStore ds, String statement, List<Object> params, String keyResult, String orderClause) throws IOException;	
	
	public enum OrderDirection {
		ASC, DESC
	}
}
