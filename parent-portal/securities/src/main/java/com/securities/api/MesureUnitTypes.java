package com.securities.api;

import java.io.IOException;
import java.util.List;

public interface MesureUnitTypes {
	MesureUnitType get(String id) throws IOException;
	List<MesureUnitType> all() throws IOException;
}
