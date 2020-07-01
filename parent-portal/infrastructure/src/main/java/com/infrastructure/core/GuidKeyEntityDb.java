package com.infrastructure.core;

import java.util.List;
import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.datasource.Base;

public abstract class GuidKeyEntityDb<T, TMetadata> extends EntityDb<T, UUID, TMetadata> {

	public GuidKeyEntityDb(Base base, UUID id, String msgNotFound) {
		super(base, id, msgNotFound);		
	}

	public GuidKeyEntityDb(Base base, UUID id, String msgNotFound, final String keyStatement, final List<Object> params) {
		super(base, id, msgNotFound, keyStatement, params);		
	}
	
	@Override
	protected UUID convertKey(Object id){
		return UUIDConvert.fromObject(id);
	}
}
