package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Profile extends Recordable<UUID, Profile> {
	String name() throws IOException;
	Company company() throws IOException;
	
	void update(String name) throws IOException;
}
