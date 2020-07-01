package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.Sequence;

public class SequenceNone extends EntityNone<Sequence, UUID> implements Sequence {

	@Override
	public String name() throws IOException {
		return "Séquence non définie";
	}

	@Override
	public String prefix() throws IOException {
		return "";
	}

	@Override
	public String suffix() throws IOException {
		return "";
	}

	@Override
	public int size() throws IOException {
		return 0;
	}

	@Override
	public int step() throws IOException {
		return 0;
	}

	@Override
	public long nextNumber() throws IOException {
		return 0;
	}

	@Override
	public String generate() throws IOException {
		throw new IllegalArgumentException("Opération de génération non supportée : séquence inexistante !");		
	}

	@Override
	public SequenceReserved code() throws IOException {
		return SequenceReserved.USER;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public void update(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException {
		throw new IllegalArgumentException("Opération de mise à jour non supportée : séquence inexistante !");
	}

	@Override
	public Sequence withDateReference(LocalDate date) throws IOException {
		throw new UnsupportedOperationException("Opération de mise à jour non supportée : séquence inexistante !");
	}

}
