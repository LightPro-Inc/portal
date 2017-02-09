package com.securities.api;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.Updatable;


public interface Persons extends AdvancedQueryable<Person, UUID>, Updatable<Person> {
	Person add(String firstName, String lastName, Sex sex, String address, LocalDate birthDate, String tel1, String tel2, String email, String photo) throws IOException;
	Person defaultPerson() throws IOException;
}
