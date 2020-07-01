package com.infrastructure.core.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import com.infrastructure.core.Horodate;

public final class HorodateNone implements Horodate {

	@Override
	public LocalDateTime dateCreated() throws IOException {
		return LocalDateTime.now();
	}

	@Override
	public LocalDateTime lastModifiedDate() throws IOException {
		return LocalDateTime.now();
	}

	@Override
	public UUID lastModifierId() throws IOException {		
		return null;
	}

	@Override
	public UUID ownerId() throws IOException {		
		return null;
	}

	@Override
	public UUID ownerCompanyId() throws IOException {
		return null;
	}
}
