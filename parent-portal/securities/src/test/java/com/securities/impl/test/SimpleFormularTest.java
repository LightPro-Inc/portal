package com.securities.impl.test;

import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;

import com.common.utilities.formular.Formular;
import com.securities.impl.SimpleFormular;

public class SimpleFormularTest {

	@Test
	public final void testCalculateAddition() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} + {op2}");
		
		Double expected = 5.0;
		Double actual = formular.withParam("{op1}", 2.0)
				                .withParam("{op2}", 3.0)
				                .result();
		
		assertEquals("addition invalide", expected, actual);
	}

	@Test
	public final void testCalculateSoustraction() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} - {op2}");

		Double expected = 1.0;
		Double actual = formular.withParam("{op1}", 3.0)
				                .withParam("{op2}", 2.0)
				                .result();
		
		assertEquals("soustraction invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateMultiplication() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} * {op2}");
		
		Double expected = 6.0;
		Double actual = formular.withParam("{op1}", 3.0)
				                .withParam("{op2}", 2.0)
				                .result();
		
		assertEquals("calcul avec multiplication invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateDivision() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} / {op2}");
		
		Double expected = 1.0;
		Double actual = formular.withParam("{op1}", 3.0)
				                .withParam("{op2}", 3.0)
				                .result();
		
		assertEquals("calcul avec division invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateWithConstant() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} + 1.5", 1, true);
		
		Double expected = 4.5;
		Double actual = formular.withParam("{op1}", 3.0).result();
		
		assertEquals("calcul avec constante invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateComplexe() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} * {op2} - {op1} / {op2} + {op1}");
		
		Double expected = 11.0;
		Double actual = formular.withParam("{op1}", 3.0)
				                .withParam("{op2}", 3.0)
				                .result();
		
		assertEquals("calcul complexe invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateComplexeMoins() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} - {op1} * {op2} - {op1}");
		
		Double expected = -9.0;
		Double actual = formular.withParam("{op1}", 3.0)
				                .withParam("{op2}", 3.0)
				                .result();
		
		assertEquals("calcul complexe moins invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateWithRoundingFloor() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} + {op2}", 2, true);
		
		Double expected = 4.55;
		Double actual = formular.withParam("{op1}", 3.559)
				                .withParam("{op2}", 1.0)
				                .result();
		
		assertEquals("calcul avec arrondi par défaut invalide", expected, actual);
	}
	
	@Test
	public final void testCalculateWithRoundingHalfUp() throws IOException {
		
		Formular formular = new SimpleFormular("{op1} + {op2}", 2, false);
		
		Double expected = 4.56;
		Double actual = formular.withParam("{op1}", 3.555)
				                .withParam("{op2}", 1.0)
				                .result();
		
		assertEquals("calcul avec arrondi par défaut invalide", expected, actual);
	}
}
