package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface PaymentMode extends Nonable {
	UUID id();
	String name() throws IOException;
	boolean active() throws IOException;
	PaymentModeType type() throws IOException;
	Admin module() throws IOException;
	
	void update(String name) throws IOException;
	void enable(boolean active) throws IOException;	
}
