package com.securities.api;

import java.io.IOException;

public interface ContactSociety extends Contact {

	String name() throws IOException;
	void updateAdministrativeInfos(String name) throws IOException;
}
