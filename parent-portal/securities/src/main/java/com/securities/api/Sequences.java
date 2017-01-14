package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Queryable;

public interface Sequences extends Queryable<Sequence> {
	Sequence get(UUID id) throws IOException;
	Sequence add(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException;	
	void delete(Sequence item) throws IOException;
}
