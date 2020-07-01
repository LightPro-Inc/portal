package com.securities.impl;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.formular.Formular;
import com.common.utilities.formular.FormularBase;
import com.securities.api.Currency;

public final class AmountFormular extends FormularBase implements Formular {

	private final String HT_FROM_TTC = "ht_from_ttc";
	private final String TTC_FROM_HT = "ttc_from_ht";
	private final String TAX_FROM_TTC = "tax_from_ttc";
	private final String TAX_FROM_HT = "tax_from_ht";
	
	private final Formular origin;
	private final Currency currency;
	
	public AmountFormular(final int precision, final Currency currency, Formular origin) {
		this.origin = origin; 
		this.currency = currency;
		this.precision = precision;
		this.arrondirParDefaut = false;
	}
	
	private String format(final String expression, final String func) {
		
		Pattern pattern = Pattern.compile(String.format("%s\\(.*?,.*?\\)", func));
		Matcher matcher = pattern.matcher(expression);
		
		String expressionFormated = expression;
		
		while (matcher.find()) {
			
			String fct = matcher.group();
			String[] operandes = StringUtils.split(fct.replace(String.format("%s(", func), "").replace(")", ""), ",", 2);
			
			Double result;
			
			if(HT_FROM_TTC.equals(func)) {
				double ttc = Double.parseDouble(operandes[0].trim());
				double ttva = Double.parseDouble(operandes[1].trim());
							
				result = 1/(1 + ttva) * ttc;
			} else if (TTC_FROM_HT.equals(func)){
				double ht = Double.parseDouble(operandes[0].trim());
				double ttva = Double.parseDouble(operandes[1].trim());
							
				result = (1 + ttva) * ht;
			} else if(TAX_FROM_TTC.equals(func)) {
				double ttc = Double.parseDouble(operandes[0].trim());
				double tax = Double.parseDouble(operandes[1].trim());
							
				result = tax/(1 + tax) * ttc;
			} else if(TAX_FROM_HT.equals(func)) {
				double ht = Double.parseDouble(operandes[0].trim());
				double tax = Double.parseDouble(operandes[1].trim());
							
				result = tax * ht;
			} else 
				throw new IllegalArgumentException(String.format("%s : fonction aggrégée non prise en charge !", func));
						
			expressionFormated = expressionFormated.replace(matcher.group(), result.toString());
		}
		
		return expressionFormated;
	}
	
	@Override
	protected String expressionFormatted() {
		
		String expressionFormatted = formatExpression(expression(), params());
		
		// rechercher les fonctions aggrégées et les calculer
		expressionFormatted = format(expressionFormatted, HT_FROM_TTC);
		expressionFormatted = format(expressionFormatted, TTC_FROM_HT);
		expressionFormatted = format(expressionFormatted, TAX_FROM_HT);
		expressionFormatted = format(expressionFormatted, TAX_FROM_TTC);
		
		return expressionFormatted;		
	}
	
	@Override
	public void validate() {
		
		String expression = expression();
		
		Pattern pattern = Pattern.compile(String.format("%s\\(.*?,.*?\\)", HT_FROM_TTC));
		Matcher matcher = pattern.matcher(expression);
		
		while (matcher.find()) {
			expression = expression.replace(matcher.group(), "0.0");
		}
		
		pattern = Pattern.compile(String.format("%s\\(.*?,.*?\\)", TTC_FROM_HT));
		matcher = pattern.matcher(expression);
		
		while (matcher.find()) {
			expression = expression.replace(matcher.group(), "0.0");
		}
		
		pattern = Pattern.compile(String.format("%s\\(.*?,.*?\\)", TAX_FROM_HT));
		matcher = pattern.matcher(expression);
		
		while (matcher.find()) {
			expression = expression.replace(matcher.group(), "0.0");
		}
		
		pattern = Pattern.compile(String.format("%s\\(.*?,.*?\\)", TAX_FROM_TTC));
		matcher = pattern.matcher(expression);
		
		while (matcher.find()) {
			expression = expression.replace(matcher.group(), "0.0");
		}
		
		if(expression.contains("(") || expression.contains(")") || expression.contains(","))
			throw new IllegalArgumentException("Les caractères '(', ')' et ',' ne sont pas acceptés !");
	}

	@Override
	public String expression() {
		return origin.expression();
	}

	@Override
	public Map<String, Double> params() {
		return origin.params();
	}

	@Override
	public Formular withExpression(String newExpression) {
		return new AmountFormular(precision, currency, origin.withExpression(newExpression));
	}

	@Override
	public Formular withParams(Map<String, Double> params) {
		return new AmountFormular(precision, currency, origin.withParams(params));
	}

	@Override
	public Formular withParam(String key, Double value) {
		return new AmountFormular(precision, currency, origin.withParam(key, value));
	}

	@Override
	public Formular removeParam(String key) {
		return new AmountFormular(precision, currency, origin.removeParam(key));
	}

	@Override
	public double result() {
		
		if(StringUtils.isBlank(expression()))
			return 0;
		
		validate();
		
		return calculate(expressionFormatted());
	}
	
	@Override
	public String toString(){
		return currency.toString(result());
	}
}
