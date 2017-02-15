package com.lightpro.admin.vm;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.User;

public class UserVm {
	
	private final transient User origin;
	private final transient boolean isCurrent;
	
	public UserVm(){
		throw new UnsupportedOperationException("#User()");
	}
	
	public UserVm(final User origin, boolean isCurrent) {
        this.origin = origin;
        this.isCurrent = isCurrent;
    }
	
	public UserVm(final User origin) {
        this.origin = origin;
        this.isCurrent = false;
    }
	
	@JsonGetter
	public UUID getId(){
		return origin.id();
	}
	
	@JsonGetter
	public String getFirstName() throws IOException {
		return origin.firstName();
	}
	
	@JsonGetter
	public String getLastName() throws IOException {
		return origin.lastName();
	}
	
	@JsonGetter
	public String getFullName() throws IOException {
		return origin.fullName();
	}
	
	@JsonGetter
	public String getSex() throws IOException{
		return origin.sex().name();
	}
	
	@JsonGetter
	public String getAddress() throws IOException {
		return origin.address();
	}
	
	@JsonGetter
	public LocalDate getBirthDate() throws IOException {
		return origin.birthDate();
	}
	
	@JsonGetter
	public String getTel1() throws IOException {
		return origin.tel1();
	}
	
	@JsonGetter
	public String getTel2() throws IOException{
		return origin.tel2();
	}
	
	@JsonGetter
	public String getEmail() throws IOException {
		return origin.email();
	}
	
	@JsonGetter
	public String getPhoto() throws IOException {
		return origin.photo();
	}
	
	@JsonGetter
	public String getFullUsername() throws IOException {
		return origin.fullUsername();
	} 
	
	@JsonGetter
	public String getUsername() throws IOException {
		return origin.username();
	}
	
	@JsonGetter
	public boolean getIsCurrent() throws IOException {
		return isCurrent;
	}  
	
	@JsonGetter
	public UUID getProfileId() throws IOException {
		return origin.profile().id();
	}
	
	@JsonGetter
	public String getProfile() throws IOException {
		return origin.profile().name();
	} 
	
	@JsonGetter
	public boolean getIsLocked() throws IOException {
		return origin.isLocked();
	}
}
