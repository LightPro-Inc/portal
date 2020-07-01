package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.Contact;
import com.securities.api.ContactNature;
import com.securities.api.ContactPerson;
import com.securities.api.ContactSociety;
import com.securities.api.PersonNaming;
import com.securities.api.Sex;

public final class ContactPersonNone extends EntityNone<Contact, UUID> implements ContactPerson {

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
		return ContactNature.NONE;
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail,String poBox, String webSite) throws IOException {
		
	}

	@Override
	public String firstName() throws IOException {
		return null;
	}

	@Override
	public String lastName() throws IOException {
		return null;
	}

	@Override
	public PersonNaming naming() throws IOException {
		return PersonNaming.NONE;
	}

	@Override
	public LocalDate birthDate() throws IOException {
		return null;
	}

	@Override
	public String birthPlace() throws IOException {
		return null;
	}

	@Override
	public Sex sex() throws IOException {
		return Sex.NONE;
	}

	@Override
	public String posteOccupe() throws IOException {
		return null;
	}

	@Override
	public ContactSociety society() throws IOException {
		return new ContactSocietyNone();
	}

	@Override
	public void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate,String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
		
	}

	@Override
	public void changeSociety(ContactSociety society) throws IOException {
		
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}
}
