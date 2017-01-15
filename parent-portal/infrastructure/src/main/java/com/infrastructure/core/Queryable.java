package com.infrastructure.core;

import java.io.IOException;
import java.util.List;

public interface Queryable<T> {
	List<T> all() throws IOException;
	List<T> find(String filter) throws IOException;		
	List<T> find(int page, int pageSize, String filter) throws IOException;
	int totalCount(String filter) throws IOException;
	boolean contains(T item) throws IOException;
	T build(Object id);	
}
