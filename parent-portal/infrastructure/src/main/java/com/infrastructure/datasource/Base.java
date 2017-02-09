package com.infrastructure.datasource;

import java.io.IOException;
import java.util.List;

import com.infrastructure.core.DomainMetadata;

public interface Base {
	
	void beginTransaction() throws IOException;
	void commit() throws IOException;
	void rollback() throws IOException;
	void terminate() throws IOException;
	Base build(String username) throws IOException;
	
	DomainsStore domainsStore(DomainMetadata dm);	
	List<Object> executeQuery(String query, List<Object> params) throws IOException;
	void executeUpdate(String query, List<Object> params) throws IOException;
	
	public enum OrderDirection {
		ASC, DESC
	}
}
