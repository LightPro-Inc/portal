package com.lightpro.admin.vm;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.securities.api.User;

public final class UserVm {
	
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
	public final String fullUsername;
	public final String username;
	public final boolean isCurrent;
	public final UUID profileId;
	public final String profile;
	public final boolean isLocked;
	public final boolean isSuperAdminUser;
	
	public UserVm(){
		throw new UnsupportedOperationException("#User()");
	}
	
	public UserVm(final User contact, boolean isCurrent) {
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
	        this.fullUsername = contact.fullUsername();
	        this.username = contact.username();
	        this.isCurrent = isCurrent;
	        this.profileId = contact.profile().id();
	        this.profile = contact.profile().name();
	        this.isLocked = contact.isLocked();
	        this.isSuperAdminUser = contact.profile().isSuperAdmin();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}		  
    }
	
	public UserVm(final User origin) {
        this(origin, false);
    }
}
