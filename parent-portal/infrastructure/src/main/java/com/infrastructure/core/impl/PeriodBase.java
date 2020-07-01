package com.infrastructure.core.impl;

import java.io.IOException;
import java.time.LocalDate;

import com.infrastructure.core.Period;

public class PeriodBase implements Period {

	private transient final LocalDate start;
	private transient final LocalDate end;
	
	public PeriodBase(final LocalDate start, final LocalDate end){
		this.start = start;	
		this.end = end;
	}
	
	@Override
	public LocalDate start() throws IOException {
		return start;
	}

	@Override
	public LocalDate end() throws IOException {
		return end;
	}

	@Override
	public boolean contains(LocalDate date) {
		return (start.isBefore(date) || start.isEqual(date)) &&
				(end.isAfter(date) || end.isEqual(date));
	}

	@Override
	public void validate() {
		if (!isDefined())
			throw new IllegalArgumentException("La période est invalide !");
	}

	@Override
	public boolean isDefined() {
		return !(start == null || end == null);
	}

	@Override
	public boolean include(Period period) {
		try {
			return contains(period.start()) && contains(period.end());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	public boolean exclude(Period period) {
		try {
			return !contains(period.start()) && !contains(period.end());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	public boolean superposeWith(Period period) {
		try {
			return contains(period.start()) || contains(period.end());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}	
}
