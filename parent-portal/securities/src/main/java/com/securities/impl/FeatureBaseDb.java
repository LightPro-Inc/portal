package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.EntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Feature;
import com.securities.api.FeatureMetadata;
import com.securities.api.ModuleType;

public abstract class FeatureBaseDb extends EntityDb<Feature, String, FeatureMetadata> implements Feature {

	public FeatureBaseDb(Base base, String id, String msgNotFound) {
		super(base, id, msgNotFound);
	}

	@Override
	public int order() throws IOException {
		return ds.get(dm.orderKey());
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}
	
	@Override
	public String description() throws IOException {
		return ds.get(dm.descriptionKey());
	}

	@Override
	public ModuleType moduleType() throws IOException {
		int typeId = ds.get(dm.moduleTypeIdKey());
		return ModuleType.get(typeId);
	}

	@Override
	protected String convertKey(Object id) {
		return id == null ? null : id.toString();
	}
}
