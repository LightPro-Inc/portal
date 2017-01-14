package com.infrastructure.core.impl;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.DomainStore;

public class HorodateImpl implements Horodate {

	private final transient DomainStore ds;
	private final transient HorodateMetadata dm = new HorodateMetadata();
	
	public HorodateImpl(final DomainStore ds){
		this.ds = ds;
	}
	
	@Override
	public Date dateCreated() throws IOException {
		return this.ds.get(dm.dateCreatedKey());
	}

	@Override
	public Date lastModifiedDate() throws IOException {
		return this.ds.get(dm.lastModifiedDateKey());
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
}
