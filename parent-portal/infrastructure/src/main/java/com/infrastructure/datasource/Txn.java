package com.infrastructure.datasource;

import java.util.concurrent.Callable;

public final class Txn {
	private final Base base;
	
	public Txn(final Base base) {
		this.base = base;
	}
	
	public <T> T call(Callable<T> callable) throws Exception {
		try {
			base.beginTransaction();														
			T result = callable.call();
			base.commit();
			return result;
		} catch(Exception e){
			base.rollback();
			throw e;
		}
		finally {
			base.terminate();
		}
	}
}
