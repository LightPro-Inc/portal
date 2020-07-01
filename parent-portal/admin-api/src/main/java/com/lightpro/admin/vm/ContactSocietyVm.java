package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Contact;

final public class ContactSocietyVm {
	
	public final UUID id;
	public final String name;
	public final String locationAddress;
	public final String phone;
	public final String mobile;
	public final String fax;
	public final String mail;
	public final String poBox;
	public final String webSite;
	public final String photo;
	
	public ContactSocietyVm() {
        throw new UnsupportedOperationException("#ContactSocietyVm()");
    }
	
	public ContactSocietyVm(final Contact contact) {        
        try {
        	this.id = contact.id();
            this.name = contact.name();
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
