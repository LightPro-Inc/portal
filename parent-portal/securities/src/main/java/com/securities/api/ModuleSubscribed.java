package com.securities.api;

import java.io.IOException;

public interface ModuleSubscribed extends Module {
	Company company() throws IOException;
}
