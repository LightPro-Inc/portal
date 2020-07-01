package com.infrastructure.core;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

public abstract class PojoDataSet<T> {
	
	protected Iterator<T> itr;

	public abstract void open(Object appContext, Map<String, Object> dataSetParamValues) throws IOException;

	public Object next() throws IOException {
		if (itr.hasNext())
            return itr.next();

        return null;
	}

	public void close() throws IOException {
		
	}	
}
