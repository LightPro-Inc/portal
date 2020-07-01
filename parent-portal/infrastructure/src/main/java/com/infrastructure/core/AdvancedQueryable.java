package com.infrastructure.core;

import java.io.IOException;
import java.util.List;

public interface AdvancedQueryable<T, TKey> extends Queryable<T, TKey> {
	List<T> find(String filter) throws IOException;		
	List<T> find(int page, int pageSize, String filter) throws IOException;
	long count(String filter) throws IOException;
}
