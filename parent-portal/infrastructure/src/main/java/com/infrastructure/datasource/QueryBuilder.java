package com.infrastructure.datasource;

import java.io.IOException;
import java.util.List;

public interface QueryBuilder {
	List<Object> find() throws IOException;
	List<Object> find(int page, int pageSize) throws IOException;
	int count() throws IOException;
	boolean exists(String key, Object value);
	double sum(String key) throws IOException;
}
