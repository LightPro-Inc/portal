package com.infrastructure.core;

import java.io.IOException;
import java.util.List;

public interface Queryable<T, TKey> extends Updatable<T>{
	T get(TKey id) throws IOException;
	List<T> all() throws IOException;	
	boolean contains(T item);
	T build(TKey id);
	long count() throws IOException;
	boolean isEmpty();
	T first() throws IOException;
	T last() throws IOException;
}
