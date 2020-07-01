package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;


public interface MesureUnits extends AdvancedQueryable<MesureUnit, UUID> {	
	MesureUnit getArticleUnit() throws IOException;
	MesureUnit add(String shortName, String fullName, MesureUnitType type) throws IOException;
	MesureUnit add(UUID id, String shortName, String fullName, MesureUnitType type) throws IOException;
	MesureUnits of(MesureUnitType type) throws IOException;
}
