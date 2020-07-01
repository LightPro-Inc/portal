package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.GuidKeyAdvancedQueryable;
import com.infrastructure.core.Period;

public interface Log extends GuidKeyAdvancedQueryable<EventLog> {
	
	void info(String info, Object... args);
	void warning(String warning, Object... args);
	void successAudit(String message, Object... args);
	void failureAudit(String message, Object... args);
	void error(String error, String details);
	
	Log ofModule(ModuleType moduleType) throws IOException;
	Log ofUser(String username) throws IOException;
	Log of(EventLogCategory eventCategory) throws IOException;
	Log of(EventLogType eventType) throws IOException;
	Log of(Period period) throws IOException;
	Log withIpAddress(String ipAddress) throws IOException;
}
