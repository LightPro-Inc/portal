package com.infrastructure.core;

import java.io.IOException;
import java.time.LocalDate;

public interface Period {
	LocalDate start() throws IOException;
	LocalDate end() throws IOException;
	boolean isDefined();
	
	boolean contains(LocalDate date);
	boolean include(Period period);
	boolean exclude(Period period);
	boolean superposeWith(Period period);
	void validate() throws IOException;
}
