package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Person extends Recordable<UUID> {
	String firstName() throws IOException;
	String lastName() throws IOException;
	String fullName() throws IOException;
	Sex sex() throws IOException;
	
	void update(String firstName, String lastName, Sex sex) throws IOException;
}
