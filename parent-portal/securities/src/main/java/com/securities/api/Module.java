package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Module extends Recordable<UUID, Module> {
	int order() throws IOException;
	String name() throws IOException;
	String shortName() throws IOException;
	String description() throws IOException;
	ModuleType type() throws IOException;
	Company company() throws IOException;
	void install() throws IOException;
	void uninstall() throws IOException;
	boolean isSubscribed();
	boolean isAvailable();
	boolean isInstalled();
}
