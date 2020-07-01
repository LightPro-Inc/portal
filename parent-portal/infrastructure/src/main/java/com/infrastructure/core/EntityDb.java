package com.infrastructure.core;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.TypeConvert;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;

public abstract class EntityDb<T, TKey, TMetadata> extends EntityBase<T, TKey> {
	
	protected final transient Base base;
	
	protected final transient TMetadata dm;
	protected final transient DomainStore ds;
	private final transient String keyStatement;
	private final transient List<Object> params;
	
	public EntityDb(final Base base, final TKey id, String msgNotFound) {
		this(base, id, msgNotFound, StringUtils.EMPTY, Arrays.asList());
	}	
	
	public EntityDb(final Base base, final TKey id, final String msgNotFound, final String keyStatement, final List<Object> params){
		super(id);
		this.base = base;
		this.dm = createMetadata();
		this.ds = createDomainStore();
		this.keyStatement = keyStatement;
		this.params = params;
		
		if(!isPresent())
			throw new IllegalArgumentException(msgNotFound);
	}
	
	protected abstract TKey convertKey(Object id);
	
	protected Object internalId(){
		if(StringUtils.isBlank(keyStatement))
			return id;
		else {
			List<Object> results;
			
			try {
				results = base.executeQuery(keyStatement, params);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
			
			if(results.isEmpty())
				return null;
			else
				return results.get(0);
		}
	}
	
	private DomainStore createDomainStore(){
		return this.base.domainsStore((DomainMetadata)this.dm).createDs(internalId());
	}
		
	@SuppressWarnings({ "unchecked" })
	private TMetadata createMetadata(){		
        try {
        	Class<?> genericType = TypeConvert.findSubClassParameterType(this, EntityDb.class, -1);
        	return (TMetadata)genericType.newInstance();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}	      
	}
	
	protected boolean isPresent(){
		return this.base.domainsStore((DomainMetadata)this.dm).exists(internalId());
	}	
	
	protected Horodate horodate(){
		return new HorodateImpl(ds);
	}
}
