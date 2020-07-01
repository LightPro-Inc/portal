package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.Queryable;

public interface Indicators extends Queryable<Indicator, Integer> {
	void add(Indicator item) throws IOException;
	Indicators of(User user) throws IOException;
	Indicators of(ModuleType moduleType) throws IOException;
}
