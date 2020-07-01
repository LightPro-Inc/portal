package com.infrastructure.core;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.List;

public abstract class QueryableBase<T, TKey> implements Queryable<T, TKey> {
	
	protected transient final String msgNotFound;
	
	public QueryableBase(String msgNotFound){
		this.msgNotFound = msgNotFound;
	}
	
	protected abstract T newOne(TKey id);
	public abstract T none();
	
	@Override
	public T get(TKey id) throws IOException {
		T item = build(id);
		
		if(!contains(item))
			throw new IllegalArgumentException(msgNotFound);
		
		return item;
	}
	
	@Override
	public T build(TKey id) {
		T t;
		try {
			t = newOne(id);						
		} catch (IllegalArgumentException e) {
			t = none();
		}
		
		return t;
	}
	
	@SuppressWarnings("rawtypes")
	protected Object idOf(T item) {
		
		Class noparams[] = {};
		Object noargs[] = {}; 
		Method method;
		
		try {
			method = item.getClass().getMethod("id", noparams);						
			return method.invoke(item, noargs);			
		} catch (Exception e) {
			throw new RuntimeException(e);
		} 
	}
	
	@Override
	public long count() throws IOException {
		return all().size();
	}
	
	public abstract List<T> all() throws IOException;	
	
	@Override
	public boolean contains(T item) {
		try {
			return all().stream().anyMatch(m -> idOf(m).equals(idOf(item)));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public boolean isEmpty() {
		try {
			return count() == 0;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public T first() throws IOException {
		return all().get(0);
	}
	
	@Override
	public T last() throws IOException {
		return all().get((int)count() - 1);
	}
}
