package com.securities.api;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface MesureUnits {
	List<MesureUnit> items() throws IOException;
	List<MesureUnit> find(String typeId) throws IOException;
	MesureUnit get(UUID id) throws IOException;
	MesureUnit getOrDefault(UUID id) throws IOException;
	MesureUnit add(String shortName, String fullName, String typeId) throws IOException;
	void delete(MesureUnit unit) throws IOException;
}
