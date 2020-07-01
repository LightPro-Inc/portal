package com.securities.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.EventLog;
import com.securities.api.EventLogCategory;
import com.securities.api.EventLogMetadata;
import com.securities.api.EventLogType;

public final class EventLogDb extends GuidKeyEntityDb<EventLog, EventLogMetadata> implements EventLog {

	public EventLogDb(final Base base, UUID id){
		super(base, id, "Evènement de log non retrouvé !");
	}

	@Override
	public LocalDateTime date() throws IOException {
		java.sql.Timestamp date = ds.get(dm.dateCreatedKey());
		return date.toLocalDateTime();
	}

	@Override
	public EventLogCategory category() throws IOException {
		int categoryId = ds.get(dm.categoryIdKey());
		return EventLogCategory.get(categoryId);
	}

	@Override
	public EventLogType type() throws IOException {
		int typeId = ds.get(dm.typeIdKey());
		return EventLogType.get(typeId);
	}

	@Override
	public String message() throws IOException {
		return ds.get(dm.messageKey());
	}

	@Override
	public String details() throws IOException {
		return ds.get(dm.detailsKey());
	}

	@Override
	public String company() throws IOException {
		return ds.get(dm.companyNameKey());
	}

	@Override
	public String module() throws IOException {
		return ds.get(dm.moduleNameKey());
	}

	@Override
	public String author() throws IOException {
		return ds.get(dm.authorNameKey());
	}

	@Override
	public String ipAddress() throws IOException {
		return ds.get(dm.ipAddressKey());
	}

	@Override
	public String authorUsername() throws IOException {
		return ds.get(dm.authorLoginKey());
	}
}
