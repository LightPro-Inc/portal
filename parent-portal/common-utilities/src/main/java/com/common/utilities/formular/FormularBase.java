package com.common.utilities.formular;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

public abstract class FormularBase implements Formular {
  
	protected transient final List<String> operators = Arrays.asList("+", "-", "*", "/");
	protected transient int precision = 0;
	protected transient boolean arrondirParDefaut = false;
	
	protected abstract String expressionFormatted();
		
	protected boolean containsOperator(String expression) {
		boolean contains = false;
		
		for (String operator : operators) {
			
			if(operator.equals("-"))
			{
				String[] operandes = StringUtils.split(expression, "-", 2);
				contains = contains || operandes.length > 1;
			}
			else
				contains = contains || expression.contains(operator);
		}
		
		return contains;
	}
	
	protected double calculate(String expressionFormatted) {
					
		Double result = calculate(expressionFormatted, "0", "+");
				
		try {
			if(arrondirParDefaut)
			{
				NumberFormat formatter = DecimalFormat.getInstance(java.util.Locale.US);
				
				formatter.setMinimumFractionDigits(precision);
				formatter.setMaximumFractionDigits(precision);
				formatter.setRoundingMode(RoundingMode.FLOOR);
				result = formatter.parse(formatter.format(result)).doubleValue();
			}
			else
			{
				int scale = (int) Math.pow(10, precision);
			    result = (double) Math.round(result * scale) / scale;
			}		
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
		
		return result;
	}
	
	protected double calculate(String op1, String op2, String operator) {
		
		double result = 0, op1Value = 0, op2Value = 0;
				
		if(!containsOperator(op1)){
			op1Value = Double.parseDouble(op1);
		} else {
						
			for (String operator1 : operators) {
				
				String[] operandes = StringUtils.split(op1, operator1, 2);
				if(operandes.length == 2){
					if(operator1.equals("-"))
					{
						if(("-" + operandes[0] + "-" + operandes[1]).equals(op1))
							op1Value = calculate("-" + operandes[0], "-" + operandes[1], "+");
						else
							op1Value = calculate(operandes[0], "-" + operandes[1], "+");
					}
					else
						op1Value = calculate(operandes[0], operandes[1], operator1);
					
					break;
				}
			}					
		}
		
		if(!containsOperator(op2)){
			op2Value = Double.parseDouble(op2);
		} else {
						
			for (String operator2 : operators) {
				
				String[] operandes = StringUtils.split(op2, operator2, 2);
				if(operandes.length == 2){
					if(operator2.equals("-"))
					{
						if(("-" + operandes[0] + "-" + operandes[1]).equals(op2))
							op2Value = calculate("-" + operandes[0], "-" + operandes[1], "+");
						else
							op2Value = calculate(operandes[0], "-" + operandes[1], "+");
					}
					else
						op2Value = calculate(operandes[0], operandes[1], operator2);
					break;
				}
			}			
		}
		
		switch (operator) {
		case "+":
			result = op1Value + op2Value;
			break;
		case "-":
			result = op1Value - op2Value;
			break;
		case "*":
			result = op1Value * op2Value;
			break;
		case "/":
			result = op1Value / op2Value;
			break;
		default:
			break;
		}
		
		return result;
	}
	
	protected List<String> buildOperandes(String expression) {
		
		List<String> operandes = new ArrayList<String>();
		
		Pattern pattern = Pattern.compile("\\{.*?\\}");
		Matcher matcher = pattern.matcher(expression);
		
		while (matcher.find()) {
			operandes.add(matcher.group());
		}
		
		return operandes.stream().distinct().collect(Collectors.toList());
	}
	
	protected String formatExpression(String expression, Map<String, Double> params){
		String expressionFormatted = expression;
		for (Entry<String, Double> entry : params.entrySet()) {
			expressionFormatted = expressionFormatted.replace(entry.getKey(), entry.getValue().toString());			
		}
		
		List<String> paramsRestants = buildOperandes(expressionFormatted);
		for (String key : paramsRestants) {
			expressionFormatted = expressionFormatted.replace(key, Double.toString(0.0));
		}
		
		return StringUtils.replace(expressionFormatted, " ", "");
	}
}
