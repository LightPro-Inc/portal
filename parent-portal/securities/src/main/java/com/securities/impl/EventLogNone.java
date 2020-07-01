package com.securities.impl;

import java.io.IOException;
import java.time.LocalDateTime;

import com.infrastructure.core.GuidKeyEntityNone;
import com.securities.api.EventLog;
import com.securities.api.EventLogCategory;
import com.securities.api.EventLogType;

public final class EventLogNone extends GuidKeyEntityNone<EventLog> implements EventLog {

	@Override
	public LocalDateTime date() throws IOException {
		return null;
	}

	@Override
	public EventLogCategory category() throws IOException {
		return EventLogCategory.NONE;
	}

	@Override
	public EventLogType type() throws IOException {
		return EventLogType.NONE;
	}

	@Override
	public String message() throws IOException {
		return null;
	}

	@Override
	public String details() throws IOException {
		return null;
	}

	@Override
	public String company() throws IOException {
		return null;
	}

	@Override
	public String module() throws IOException {
		return null;
	}

	@Override
	public String author() throws IOException {
		return null;
	}

	@Override
	public String ipAddress() throws IOException {
		return null;
	}

	@Override
	public String authorUsername() throws IOException {
		return null;
	}
}
