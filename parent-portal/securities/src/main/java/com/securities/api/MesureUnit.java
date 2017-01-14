package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface MesureUnit extends Recordable<UUID> {
	String shortName() throws IOException;
	String fullName() throws IOException;
	MesureUnitType type() throws IOException;
	void update(String shortName, String fullName, String typeId) throws IOException;
}
