package com.common.utilities.formular;

import java.util.Map;

public interface Formular {
	
	String expression();
	Map<String, Double> params();
	
	void validate();
	
	Formular withExpression(String newExpression);
	Formular withParams(Map<String, Double> params);
	Formular withParam(String key, Double value);	
	Formular removeParam(String key);
	
	double result();
}
