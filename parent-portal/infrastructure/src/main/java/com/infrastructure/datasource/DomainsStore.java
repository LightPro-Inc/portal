package com.infrastructure.datasource;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.datasource.Base.OrderDirection;

public interface DomainsStore {	
	DomainStore createDs(Object key);
	DomainMetadata dm();
	List<DomainStore> findDs(String statement, List<Object> params) throws IOException;
	List<Object> find(String statement, List<Object> params) throws IOException;
	List<DomainStore> getAll() throws IOException;
	List<DomainStore> getAllOrdered(String orderKey, OrderDirection direction) throws IOException;
	List<DomainStore> getAllByKeyOrdered(String key, Object keyValue, String orderKey, OrderDirection direction) throws IOException;
	void set(Object key, Map<String, Object> params) throws IOException;
	boolean exists(Object key) throws IOException;		
	void delete(Object key) throws IOException;
	
	void execute(String statement, List<Object> params) throws IOException;
}
