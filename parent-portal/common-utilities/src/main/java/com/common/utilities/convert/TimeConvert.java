package com.common.utilities.convert;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class TimeConvert {
	public static LocalDate toLocalDate(Date date, ZoneId zoneId){
		if(date == null)
			return null;
		else
			return Instant.ofEpochMilli(date.getTime()).atZone(zoneId).toLocalDate();
	}
	
	public static LocalDateTime toLocalDateTime(Date date, ZoneId zoneId){
		if(date == null)
			return null;
		else
			return Instant.ofEpochMilli(date.getTime()).atZone(zoneId).toLocalDateTime();
	}
	
	public static Date toDate(LocalDate date, ZoneId zoneId){
		if(date == null)
			return null;
		else
			return Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}
	
	public static Date toDate(LocalDateTime date, ZoneId zoneId){
		if(date == null)
			return null;
		else
			return Date.from(date.atZone(zoneId).toInstant());
	}
}
