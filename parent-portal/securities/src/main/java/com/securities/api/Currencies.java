package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.AdvancedQueryable;

public interface Currencies extends AdvancedQueryable<Currency, String> {
	Currency add(String id, String name, String symbol, int precision, boolean after) throws IOException;
}
