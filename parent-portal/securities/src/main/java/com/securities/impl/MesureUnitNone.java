package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitType;

public final class MesureUnitNone extends EntityNone<MesureUnit, UUID> implements MesureUnit {

	@Override
	public String shortName() throws IOException {
		return null;
	}

	@Override
	public String fullName() throws IOException {
		return null;
	}

	@Override
	public MesureUnitType type() throws IOException {
		return MesureUnitType.NONE;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public void update(String shortName, String fullName, MesureUnitType type) throws IOException {		

	}
}
