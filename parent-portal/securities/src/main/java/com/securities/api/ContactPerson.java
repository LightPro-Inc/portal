package com.securities.api;

import java.io.IOException;
import java.time.LocalDate;

public interface ContactPerson extends Contact {
	
	String firstName() throws IOException;
	String lastName() throws IOException;
	PersonNaming naming() throws IOException;
	LocalDate birthDate() throws IOException;
	String birthPlace() throws IOException;
	Sex sex() throws IOException;
	String posteOccupe() throws IOException;
	ContactSociety society() throws IOException;
	
	void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException;		
	void changeSociety(ContactSociety society) throws IOException;
}
