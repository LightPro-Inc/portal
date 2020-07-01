package com.infrastructure.core;

import java.io.IOException;

import com.common.utilities.convert.TypeConvert;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;

public abstract class QueryableDb<T, TKey, TMetadata> extends QueryableBase<T, TKey> {
	
	protected transient final Base base;
	protected final transient TMetadata dm;
	protected final transient DomainsStore ds;
	
	public QueryableDb(final Base base, String msgNotFound){
		super(msgNotFound);
		this.base = base;
		this.dm = createMetadata();
		this.ds = this.base.domainsStore((DomainMetadata)this.dm);
	}
	
	@SuppressWarnings({ "unchecked" })
	private TMetadata createMetadata(){
		try {
        	Class<?> genericType = TypeConvert.findSubClassParameterType(this, QueryableDb.class, -1);
        	return (TMetadata)genericType.newInstance();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public void delete(T item) throws IOException {
		if(contains(item))
			ds.delete(idOf(item));
	}
}
