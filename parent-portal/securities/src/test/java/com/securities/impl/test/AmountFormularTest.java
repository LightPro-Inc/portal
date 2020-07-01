package com.securities.impl.test;

import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;

import com.common.utilities.formular.Formular;
import com.securities.api.Currency;
import com.securities.mocks.CurrencyMock;

public class AmountFormularTest {

	private final Currency currency = new CurrencyMock();
	
	@Test
	public final void testCalculateHtFromTtc() throws IOException {
		
		Formular formular = currency.calculator().withExpression("ht_from_ttc({op1}, {op2})");
		
		Double expected = 233.05;
		Double actual = formular.withParam("{op1}", 275.0)
				                .withParam("{op2}", 0.18)
				                .result();
		
		assertEquals("Calcul de HT à partir de montant TTC invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateTtcFromHt() throws IOException {
		
		Formular formular = currency.calculator().withExpression("ttc_from_ht({op1}, {op2})");
		
		Double expected = 275.0;
		Double actual = formular.withParam("{op1}", 233.05)
				                .withParam("{op2}", 0.18)
				                .result();
		
		assertEquals("Calcul de taxe à partir de montant HT invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateTaxFromTtc() throws IOException {
		
		Formular formular = currency.calculator().withExpression("tax_from_ttc({op1}, {op2})");
		
		Double expected = 41.95;
		Double actual = formular.withParam("{op1}", 275.0)
				                .withParam("{op2}", 0.18)
				                .result();
		
		assertEquals("Calcul de taxe à partir de montant TTC invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateTaxFromHt() throws IOException {
		
		Formular formular = currency.calculator().withExpression("tax_from_ht({op1}, {op2})");
		
		Double expected = 41.95;
		Double actual = formular.withParam("{op1}", 233.05)
				                .withParam("{op2}", 0.18)
				                .result();
		
		assertEquals("Calcul de taxe à partir de montant HT invalide", expected, actual);
	}
}
