package com.lightpro.portal.rs;

import java.lang.annotation.Annotation;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;

import org.apache.commons.lang3.StringUtils;

public class DateParamerterConverterProvider implements ParamConverterProvider {

	@Override
	public <T> ParamConverter<T> getConverter(Class<T> rawType, java.lang.reflect.Type genericType, Annotation[] annotations) {
		if(rawType.getName().equals(Date.class.getName())){
			return new ParamConverter<T>(){
				public static final String format = "yyyy-MM-dd";
				
				@Override
				public T fromString(String string) {
					if(StringUtils.isBlank(string))
						return null;
					
					SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
					try {
						Date date = simpleDateFormat.parse(string);
						return rawType.cast(date);
					} catch (ParseException e) {
						throw new WebApplicationException(e);
					}
				}

				@Override
				public String toString(T t) {
					if(t == null)
						return null;
					
					return new SimpleDateFormat(format).format((Date)t);
				}
			};
		}
		
		return null;
	}
}
