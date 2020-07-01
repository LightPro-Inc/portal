package com.securities.api;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;

public interface Taxes extends AdvancedQueryable<Tax, UUID> {
	List<Tax> getVatTaxes() throws IOException;
	Tax add(TaxType type, String name, String shortName, double value, NumberValueType valueType) throws IOException;		
	String toString();
}
