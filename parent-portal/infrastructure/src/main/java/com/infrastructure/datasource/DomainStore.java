package com.infrastructure.datasource;

import java.io.IOException;
import java.util.Map;

import com.infrastructure.core.DomainMetadata;

public interface DomainStore {
	DomainMetadata dm();
	Object key();
	<T> T get(String propertyKey)  throws IOException;
	void set(String propertyKey, Object value)  throws IOException;
	void set(Map<String, Object> params)  throws IOException;
}
