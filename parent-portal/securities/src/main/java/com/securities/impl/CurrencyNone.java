package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.EntityNone;
import com.securities.api.Currency;

public final class CurrencyNone extends EntityNone<Currency, String> implements Currency {

	@Override
	public String id() {
		return null;
	}

	@Override
	public String name() throws IOException {
		return null;
	}

	@Override
	public String symbol() throws IOException {
		return null;
	}

	@Override
	public boolean after() throws IOException {
		return false;
	}

	@Override
	public int precision() throws IOException {
		return 0;
	}

	@Override
	public void update(String name, String symbol, int precision, boolean after) throws IOException {

	}

	@Override
	public String toString(double amount) {
		return null;
	}

	@Override
	public double toCurrency(double amount) {
		return 0;
	}

	@Override
	public AmountFormular calculator() throws IOException {
		return null;
	}
}
