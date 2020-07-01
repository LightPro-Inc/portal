package com.lightpro.admin.vm;

import java.io.IOException;

import com.fasterxml.jackson.annotation.JsonGetter;

public final class MonthVm {
	
	private final transient String name;
	private final transient int number;
	
	public MonthVm() {
        throw new UnsupportedOperationException("#MonthVm()");
    }
	
	public MonthVm(final String name, final int number) {
        this.name = name;
        this.number = number;
    }
	
	@JsonGetter
	public String getName(){
		return name;
	}
	
	@JsonGetter
	public int getNumber() throws IOException {
		return number;
	}
}
