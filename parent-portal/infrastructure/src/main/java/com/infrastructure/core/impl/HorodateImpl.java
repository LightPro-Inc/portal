package com.infrastructure.core.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.DomainStore;

public final class HorodateImpl implements Horodate {

	private final transient DomainStore ds;
	private final transient HorodateMetadata dm = new HorodateMetadata();
	
	public HorodateImpl(final DomainStore ds){
		this.ds = ds;
	}
	
	@Override
	public LocalDateTime dateCreated() throws IOException {
		java.sql.Timestamp time = this.ds.get(dm.dateCreatedKey());
		return time.toLocalDateTime();
	}

	@Override
	public LocalDateTime lastModifiedDate() throws IOException {
		java.sql.Timestamp time = this.ds.get(dm.lastModifiedDateKey());
		return time.toLocalDateTime();
	}

	@Override
	public UUID lastModifierId() throws IOException {
		return this.ds.get(dm.lastModifierIdKey());
	}

	@Override
	public UUID ownerId() throws IOException {
		return this.ds.get(dm.ownerIdKey());
	}
	
	public static HorodateMetadata dm(){
		return new HorodateMetadata();
	}

	@Override
	public UUID ownerCompanyId() throws IOException {
		return ds.get(dm.ownerCompanyIdKey());
	}
}
