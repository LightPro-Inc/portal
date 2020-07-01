package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.Updatable;

public interface Profiles extends AdvancedQueryable<Profile, UUID>, Updatable<Profile> {
	Profile add(String name) throws IOException;
	Profile add(String name, boolean isSuperAdmin) throws IOException;
	Profile superAdministratorProfile() throws IOException;
}
