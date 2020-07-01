package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.EntityNone;
import com.securities.api.Indicator;
import com.securities.api.ModuleType;

public final class IndicatorNone extends EntityNone<Indicator, Integer> implements Indicator {

	@Override
	public String name() throws IOException {
		return "Aucun indicateur";
	}

	@Override
	public String shortName() throws IOException {
		return null;
	}

	@Override
	public String description() throws IOException {
		return null;
	}

	@Override
	public int order() throws IOException {
		return 0;
	}

	@Override
	public ModuleType moduleType() throws IOException {
		return ModuleType.NONE;
	}
}
