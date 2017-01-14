package com.securities.api;

import java.io.IOException;
import java.util.List;

/**
 * Modules manager of a company
 * @author oob
 *
 */
public interface Modules {
	List<Module> availables() throws IOException;
	List<Module> installed() throws IOException;
	Module install(String moduleid) throws IOException;
	Module uninstall(String moduleid) throws IOException;
}