package com.securities.mocks;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;

import com.securities.api.Currency;
import com.securities.impl.AmountFormular;
import com.securities.impl.SimpleFormular;

public class CurrencyMock implements Currency {

	@Override
	public boolean isNone() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String id() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String name() throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String symbol() throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean after() throws IOException {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int precision() throws IOException {
		return 2;
	}

	@Override
	public String toString(double amount) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public double toCurrency(double amount) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public AmountFormular calculator() throws IOException {
		return new AmountFormular(2, this, new SimpleFormular(StringUtils.EMPTY));
	}

	@Override
	public void update(String name, String symbol, int precision, boolean after) throws IOException {
		// TODO Auto-generated method stub

	}
}
