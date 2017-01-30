package com.securities.api;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Person extends Recordable<UUID, Person> {
	String firstName() throws IOException;
	String lastName() throws IOException;
	String fullName() throws IOException;
	Sex sex() throws IOException;
	String address() throws IOException;
	Date birthDate() throws IOException;
	String tel1() throws IOException;
	String tel2() throws IOException;
	String email() throws IOException;
	String photo() throws IOException;
	
	void update(String firstName, String lastName, Sex sex, String address, Date birthDate, String tel1, String tel2, String email, String photo) throws IOException;
}
