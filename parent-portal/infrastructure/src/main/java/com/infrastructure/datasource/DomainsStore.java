package com.infrastructure.datasource;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.datasource.Base.OrderDirection;

public interface DomainsStore {	
	DomainStore createDs(Object key);
	DomainMetadata dm();
	
	List<DomainStore> findDs(String statement, List<Object> params) throws IOException;
	List<Object> find(String statement, List<Object> params) throws IOException;
	List<Object> findPagined(String statement, List<Object> params, int page, int pageSize) throws IOException;
	
	long count(String statement, List<Object> params) throws IOException;
	
	Optional<Object> getFirst(String statement, List<Object> params) throws IOException;
	Optional<DomainStore> getFirstDs(String statement, List<Object> params) throws IOException;
	
	List<DomainStore> getAll() throws IOException;
	List<DomainStore> getAllOrdered(String orderKey, OrderDirection direction) throws IOException;
	List<DomainStore> getAllByKey(String key, Object keyValue) throws IOException;
	List<DomainStore> getAllByKeyOrdered(String key, Object keyValue, String orderKey, OrderDirection direction) throws IOException;
	
	void set(Object key, Map<String, Object> params) throws IOException;
	
	boolean exists(Object key);		
	boolean exists(String key, Object keyValue);
	boolean exists(String key1, Object value1, String key2, Object value2);
	
	void delete(Object key) throws IOException;
	
	void execute(String statement, List<Object> params) throws IOException;
}
