package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.EntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Indicator;
import com.securities.api.IndicatorMetadata;
import com.securities.api.ModuleType;

public final class IndicatorDb extends EntityDb<Indicator, Integer, IndicatorMetadata> implements Indicator {

	public IndicatorDb(Base base, Integer id) {
		super(base, id, "Indicateur introuvable !");
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public String shortName() throws IOException {
		return ds.get(dm.shortNameKey());
	}

	@Override
	public String description() throws IOException {
		return ds.get(dm.descriptionKey());
	}

	@Override
	public int order() throws IOException {
		return ds.get(dm.orderKey());
	}

	@Override
	public ModuleType moduleType() throws IOException {
		int moduleTypeId = ds.get(dm.moduleTypeIdKey());
		return ModuleType.get(moduleTypeId);
	}

	@Override
	protected Integer convertKey(Object id) {
		return Integer.parseInt(id.toString());
	}

}
