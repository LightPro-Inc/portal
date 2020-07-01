package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface MesureUnit extends Nonable {
	UUID id();
	String shortName() throws IOException;
	String fullName() throws IOException;
	MesureUnitType type() throws IOException;
	Company company() throws IOException;
	void update(String shortName, String fullName, MesureUnitType type) throws IOException;
}
