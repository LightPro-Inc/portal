package com.lightpro.admin.vm;

import java.io.IOException;

import com.fasterxml.jackson.annotation.JsonGetter;

public class DayVm {
	
	private final transient String name;
	private final transient int dayOfMonth;
	private final transient int month;
	private final transient int year;
	
	public DayVm() {
        throw new UnsupportedOperationException("#DayVm()");
    }
	
	public DayVm(final String name, final int dayOfMonth, final int month, final int year) {
        this.name = name;
        this.dayOfMonth = dayOfMonth;
        this.month = month;
        this.year = year;
    }
	
	@JsonGetter
	public String getName(){
		return name;
	}
	
	@JsonGetter
	public int getDayOfMonth() throws IOException {
		return dayOfMonth;
	}
	
	@JsonGetter
	public int getMonth() throws IOException {
		return month;
	}
	
	@JsonGetter
	public int getYear() throws IOException {
		return year;
	}
}
