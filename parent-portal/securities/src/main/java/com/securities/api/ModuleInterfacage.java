package com.securities.api;

import java.io.IOException;
import java.util.List;

public interface ModuleInterfacage {
	List<Module> modulesAvailable() throws IOException;
}
