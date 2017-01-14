package com.securities.api;

import java.io.IOException;

import com.infrastructure.core.Oneness;

public interface Module extends Oneness<String> {
	String name() throws IOException;
	String description() throws IOException;
	String url() throws IOException;
	void install() throws IOException;
	void uninstall() throws IOException;
}
