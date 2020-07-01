package com.securities.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.formular.Formular;
import com.common.utilities.formular.FormularBase;

public final class SimpleFormular extends FormularBase implements Formular {

	private transient final String expression;	
	private transient final Map<String, Double> params;
	
	public SimpleFormular(final String expression){
		this(expression, 0, true, new HashMap<String, Double>());
	}
	
	public SimpleFormular(final String expression, final Map<String, Double> params){
		this(expression, 0, true, params);
	}
	
	public SimpleFormular(final String expression, final int precision, final boolean arrondirParDefaut){
		this(expression, precision, arrondirParDefaut, new HashMap<String, Double>());
	}
	
	public SimpleFormular(final String expression, final int precision, final boolean arrondirParDefaut, final Map<String, Double> params){
		this.expression = StringUtils.defaultString(expression).trim();
		this.precision = precision < 0 ? 0 : precision;
		this.arrondirParDefaut = arrondirParDefaut;
		this.params = params;
	}

	@Override
	public String expression() {
		return expression;
	}
	
	@Override
	public double result() {
		
		if(StringUtils.isBlank(expression))
			return 0;
		
		validate();
		
		return calculate(expressionFormatted());	
	}
	
	@Override
	public void validate() {
		String expression = expressionFormatted();
		
		if(expression.contains("(") || expression.contains(")") || expression.contains(","))
			throw new IllegalArgumentException("Les caractères '(', ')' et ',' ne sont pas acceptés !");	
	}
	
	@Override
	protected String expressionFormatted() {
		return formatExpression(expression, params());
	}
		
	@Override
	public Formular withParam(String key, Double value) {
		
		Map<String, Double> paramsCopy = params();
		
		if(paramsCopy.containsKey(key))
			paramsCopy.replace(key, value);
		else
			paramsCopy.put(key, value);
		
		return new SimpleFormular(expression, precision, arrondirParDefaut, paramsCopy);
	}

	@Override
	public Map<String, Double> params() {
		
		// cloner
		Map<String, Double> paramsCopy = new HashMap<String, Double>();
		paramsCopy.putAll(params);
		
		return paramsCopy;
	}

	@Override
	public Formular removeParam(String key) {
		Map<String, Double> paramsCopy = params();
		
		paramsCopy.remove(key);
		
		return new SimpleFormular(expression, precision, arrondirParDefaut, paramsCopy);
	}

	@Override
	public Formular withParams(Map<String, Double> params) {
		
		Map<String, Double> paramsCopy = params();
		
		for (Entry<String, Double> param : params.entrySet()) {
			if(paramsCopy.containsKey(param.getKey()))
				paramsCopy.replace(param.getKey(), param.getValue());
			else
				paramsCopy.put(param.getKey(), param.getValue());
		}
				
		return new SimpleFormular(expression, precision, arrondirParDefaut, paramsCopy);
	}

	@Override
	public Formular withExpression(String newExpression) {
		return new SimpleFormular(newExpression, precision, arrondirParDefaut, params);
	}
}
