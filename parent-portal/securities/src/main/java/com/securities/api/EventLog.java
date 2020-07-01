package com.securities.api;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface EventLog extends Nonable {
	UUID id();
	LocalDateTime date() throws IOException;
	EventLogCategory category() throws IOException;
	EventLogType type() throws IOException;
	String message() throws IOException;
	String details() throws IOException;
	String company() throws IOException;
	String module() throws IOException;
	String author() throws IOException;
	String authorUsername() throws IOException;
	String ipAddress() throws IOException;
}
