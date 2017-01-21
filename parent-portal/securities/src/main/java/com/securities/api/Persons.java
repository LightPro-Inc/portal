package com.securities.api;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import com.infrastructure.core.Queryable;


public interface Persons extends Queryable<Person> {
	Person add(String firstName, String lastName, Sex sex, String address, Date birthDate, String tel1, String tel2, String email, String photo) throws IOException;
	void delete(Person item) throws IOException;
	Person get(UUID id) throws IOException;
}
