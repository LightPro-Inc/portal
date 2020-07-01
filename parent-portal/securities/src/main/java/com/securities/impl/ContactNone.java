package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.Contact;
import com.securities.api.ContactNature;

public final class ContactNone extends EntityNone<Contact, UUID> implements Contact {

	@Override
	public String name() throws IOException {
		return null;
	}

	@Override
	public String locationAddress() throws IOException {
		return null;
	}

	@Override
	public String phone() throws IOException {
		return null;
	}

	@Override
	public String mobile() throws IOException {
		return null;
	}

	@Override
	public String fax() throws IOException {
		return null;
	}

	@Override
	public String mail() throws IOException {
		return null;
	}

	@Override
	public String poBox() throws IOException {
		return null;
	}

	@Override
	public String webSite() throws IOException {
		return null;
	}

	@Override
	public String photo() throws IOException {
		return null;
	}

	@Override
	public ContactNature nature() throws IOException {
		return null;
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail, String poBox, String webSite) throws IOException {

	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}
}
