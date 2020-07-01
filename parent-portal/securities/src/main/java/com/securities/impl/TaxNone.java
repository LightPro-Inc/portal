package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.NumberValueType;
import com.securities.api.Tax;
import com.securities.api.TaxType;

public final class TaxNone extends EntityNone<Tax, UUID> implements Tax {

	@Override
	public TaxType type() throws IOException {		
		return TaxType.NONE;
	}

	@Override
	public String name() throws IOException {		
		return null;
	}

	@Override
	public String shortName() throws IOException {		
		return null;
	}

	@Override
	public double value() throws IOException {		
		return 0;
	}

	@Override
	public double decimalValue() throws IOException {		
		return 0;
	}

	@Override
	public NumberValueType valueType() throws IOException {		
		return NumberValueType.AMOUNT;
	}

	@Override
	public String valueToString() {		
		return null;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public void update(TaxType type, String name, String shortName, double value, NumberValueType valueType)
			throws IOException {		

	}

	@Override
	public double evaluateAmount(double amountHt) throws IOException {		
		return 0;
	}
}
