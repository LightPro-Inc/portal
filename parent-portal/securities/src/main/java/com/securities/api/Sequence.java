package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Sequence extends Recordable<UUID> {
	String name() throws IOException;
	String prefix() throws IOException;
	String suffix() throws IOException;
	int size() throws IOException;
	int step() throws IOException;
	long nextNumber() throws IOException;
	String generate() throws IOException;
	
	void update(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException;
}
