package com.lightpro.admin.vm;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.securities.api.ContactPerson;

final public class ContactPersonVm {
	
	public final UUID id;
	public final String name;
	public final String firstName;
	public final String lastName;
	public final String naming;
	public final int namingId;
	public final LocalDate birthDate;
	public final String birthPlace;
	public final String sex;
	public final int sexId;
	public final String posteOccupe;
	public final String locationAddress;
	public final String phone;
	public final String mobile;
	public final String fax;
	public final String mail;
	public final String poBox;
	public final String webSite;
	public final String photo;
	
	public ContactPersonVm() {
        throw new UnsupportedOperationException("#ContactPersonVm()");
    }
	
	public ContactPersonVm(final ContactPerson contact) {
		try {
			this.id = contact.id();
	        this.name = contact.name();
	        this.firstName = contact.firstName();
	        this.lastName = contact.lastName();
	        this.naming = contact.naming().toString();
	        this.namingId = contact.naming().id();
	        this.birthDate = contact.birthDate();
	        this.birthPlace = contact.birthPlace();
	        this.sex = contact.sex().toString();
	        this.sexId = contact.sex().id();
	        this.posteOccupe = contact.posteOccupe();
	        this.locationAddress = contact.locationAddress();
	        this.phone = contact.phone();
	        this.mobile = contact.mobile();
	        this.fax = contact.fax();
	        this.mail = contact.mail();
	        this.poBox = contact.poBox();
	        this.webSite = contact.webSite();
	        this.photo = contact.photo();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}		        
    }
}
