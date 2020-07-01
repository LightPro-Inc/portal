package com.infrastructure.core;

import java.util.UUID;

import com.infrastructure.datasource.Base;

public abstract class GuidKeyQueryableDb<T, TMetadata> extends QueryableDb<T, UUID, TMetadata> {

	public GuidKeyQueryableDb(Base base, String msgNotFound) {
		super(base, msgNotFound);		
	}	
}
