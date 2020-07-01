package com.infrastructure.core.impl;

import java.io.IOException;
import java.time.LocalDate;

import com.infrastructure.core.Period;

public class PeriodNone implements Period {

	@Override
	public LocalDate start() throws IOException {
		return null;
	}

	@Override
	public LocalDate end() throws IOException {
		return null;
	}

	@Override
	public boolean contains(LocalDate date) {
		return false;
	}

	@Override
	public void validate() throws IOException {
		throw new IllegalArgumentException("La période n'est pas définie !");
	}

	@Override
	public boolean isDefined() {
		return false;
	}

	@Override
	public boolean include(Period period) {
		return false;
	}

	@Override
	public boolean exclude(Period period) {
		return false;
	}

	@Override
	public boolean superposeWith(Period period) {
		return false;
	}
}
