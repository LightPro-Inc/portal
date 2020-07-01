package com.securities.api;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.UseCode;

public interface Contacts extends AdvancedQueryable<Contact, UUID>{

	ContactPerson addPerson(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException;
	ContactSociety addSociety(String name) throws IOException;
	
	ContactPerson person(UUID id) throws IOException;
	ContactSociety society(UUID id) throws IOException;
	
	ContactPerson buildPerson(UUID id) throws IOException;
	ContactSociety buildSociety(UUID id) throws IOException;
	
	Contacts of(ContactRole role) throws IOException;
	Contacts of(ContactNature nature) throws IOException;
	Contacts of(UseCode useCode) throws IOException;
	
	ContactPerson defaultPerson() throws IOException;	
	ContactPerson adminPerson() throws IOException;
	ContactSociety myCompany() throws IOException;
}
