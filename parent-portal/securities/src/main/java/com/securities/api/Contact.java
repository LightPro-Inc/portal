package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface Contact extends Nonable {

	UUID id();
	String name() throws IOException;
	String locationAddress() throws IOException;
	String phone() throws IOException;
	String mobile() throws IOException;
	String fax() throws IOException;
	String mail() throws IOException;
	String poBox() throws IOException;
	String webSite() throws IOException;
	String photo() throws IOException;
	ContactNature nature() throws IOException;
	Company company() throws IOException;
	
	void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail, String poBox, String webSite) throws IOException;
}
