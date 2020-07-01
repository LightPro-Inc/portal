package com.infrastructure.core;

import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.datasource.Base;

public abstract class GuidKeyAdvancedQueryableDb<T, TMetadata> extends AdvancedQueryableDb<T, UUID, TMetadata> {

	public GuidKeyAdvancedQueryableDb(Base base, String msgNotFound) {
		super(base, msgNotFound);
	}
	
	@Override
	protected UUID convertKey(Object id){
		return UUIDConvert.fromObject(id);
	}
}
