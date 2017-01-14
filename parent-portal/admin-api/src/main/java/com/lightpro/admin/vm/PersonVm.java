package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.Person;

final public class PersonVm {
	private final transient Person human;
	
	public PersonVm() {
        throw new UnsupportedOperationException("#HumanVm()");
    }
	
	public PersonVm(final Person hmn) {
        this.human = hmn;
    }
	
	@JsonGetter
	UUID getId(){
		return this.human.id();
	}
	
	@JsonGetter
	String getFirstName() throws IOException {
		return this.human.firstName();
	}
	
	@JsonGetter
	String getLastName() throws IOException {
		return this.human.lastName();
	}
	
	@JsonGetter
	String getFullName() throws IOException {
		return this.human.fullName();
	}
	
	@JsonGetter
	Date getDateCreated() throws IOException {
		return this.human.horodate().dateCreated();
	}	
}
