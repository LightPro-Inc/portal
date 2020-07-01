package com.infrastructure.core;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.ws.rs.core.StreamingOutput;

public interface Report {
	String directory();
	String reportName();
	
	void render(String format, OutputStream output) throws IOException;
	ByteArrayOutputStream renderAsByteArray(String format) throws IOException;
	StreamingOutput renderAsStreaming(String format) throws IOException;
	ByteArrayOutputStream renderPDFAsByteArray() throws IOException;
	StreamingOutput renderPDFAsStreaming() throws IOException;
}
