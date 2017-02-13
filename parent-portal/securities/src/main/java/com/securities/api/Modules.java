package com.securities.api;

import java.io.IOException;
import java.util.List;

/**
 * Modules manager of a company
 * @author oob
 *
 */

public interface Modules {
	List<Module> subscribed() throws IOException;
	List<Module> availables() throws IOException;
	List<Module> installed() throws IOException;
	List<Module> used() throws IOException;
	
	void install(Module module) throws IOException;
	void uninstall(Module module) throws IOException;
	void activate(Module module, boolean active) throws IOException;
	Module get(ModuleType type) throws IOException;
}