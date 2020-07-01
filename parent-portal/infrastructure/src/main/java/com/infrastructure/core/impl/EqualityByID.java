package com.infrastructure.core.impl;

import java.lang.reflect.Method;

import com.infrastructure.core.Equalable;

public final class EqualityByID<T> implements Equalable {
	
	private final T o;
	
	public EqualityByID(T o){
		this.o = o;
	}
	
	@Override
	public boolean equals(Object o){
		if(this.o == o)
			return true;
		
		@SuppressWarnings("unchecked")
		T item = (T)o;
		
		Object id = idOf(this.o);
		Object itemId = idOf(item);
		boolean equals = (id != null && (id.equals(itemId))) || (id == null && id == itemId);
		return equals;
	}
	
	@SuppressWarnings("rawtypes")
	private Object idOf(T item) {
		
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
}
