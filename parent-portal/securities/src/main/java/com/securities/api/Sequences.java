package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.Updatable;

public interface Sequences extends AdvancedQueryable<Sequence, UUID>, Updatable<Sequence> {
	Sequence add(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException;	
}
