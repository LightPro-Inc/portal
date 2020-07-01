package com.infrastructure.datasource;

import java.util.concurrent.Callable;

public final class Txn {
	private final Base base;
	
	public Txn(final Base base) {
		this.base = base;
	}
	
	public <T> T call(Callable<T> callable) throws Exception {
		T result;
		
		try {													
			result = callable.call();
			base.commit();
		} catch(Exception e){
			base.rollback();
			throw e;
		}
		finally {
			base.terminate();
		}
		
		return result;
	}
}
