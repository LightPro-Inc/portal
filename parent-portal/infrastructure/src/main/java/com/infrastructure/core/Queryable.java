package com.infrastructure.core;

import java.io.IOException;
import java.util.List;

public interface Queryable<T, TKey> {
	T get(TKey id) throws IOException;
	List<T> all() throws IOException;	
	boolean contains(T item);
	T build(TKey id);	
}
