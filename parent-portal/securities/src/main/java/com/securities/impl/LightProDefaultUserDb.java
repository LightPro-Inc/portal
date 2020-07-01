package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.ContactNature;
import com.securities.api.ContactSociety;
import com.securities.api.Indicators;
import com.securities.api.Module;
import com.securities.api.PersonNaming;
import com.securities.api.Profile;
import com.securities.api.Sex;
import com.securities.api.User;

public final class LightProDefaultUserDb implements User {

	private final User origin;
	
	public LightProDefaultUserDb(final Base base){
		this.origin = new UserDb(base, new ContactPersonDb(base, UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985")));
	}
	
	@Override
	public String firstName() throws IOException {
		return origin.firstName();
	}

	@Override
	public String lastName() throws IOException {
		return origin.lastName();
	}

	@Override
	public PersonNaming naming() throws IOException {
		return origin.naming();
	}

	@Override
	public LocalDate birthDate() throws IOException {
		return origin.birthDate();
	}

	@Override
	public String birthPlace() throws IOException {
		return origin.birthPlace();
	}

	@Override
	public Sex sex() throws IOException {
		return origin.sex();
	}

	@Override
	public String posteOccupe() throws IOException {
		return origin.posteOccupe();
	}

	@Override
	public ContactSociety society() throws IOException {
		return origin.society();
	}

	@Override
	public void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate,
			String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
		origin.updatePersonalInfos(firstName, lastName, naming, birthDate, birthPlace, sex, posteOccupe, photo);
	}

	@Override
	public void changeSociety(ContactSociety society) throws IOException {
		origin.changeSociety(society);
	}

	@Override
	public UUID id() {
		return origin.id();
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public String locationAddress() throws IOException {
		return origin.locationAddress();
	}

	@Override
	public String phone() throws IOException {
		return origin.phone();
	}

	@Override
	public String mobile() throws IOException {
		return origin.mobile();
	}

	@Override
	public String fax() throws IOException {
		return origin.fax();
	}

	@Override
	public String mail() throws IOException {
		return origin.mail();
	}

	@Override
	public String poBox() throws IOException {
		return origin.poBox();
	}

	@Override
	public String webSite() throws IOException {
		return origin.webSite();
	}

	@Override
	public String photo() throws IOException {
		return origin.photo();
	}

	@Override
	public ContactNature nature() throws IOException {
		return origin.nature();
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail,
			String poBox, String webSite) throws IOException {
		origin.updateAddresses(locationAddress, phone, mobile, fax, mail, poBox, webSite);
	}

	@Override
	public boolean isNone() {
		return origin.isNone();
	}

	@Override
	public String username() throws IOException {
		return origin.username();
	}

	@Override
	public String fullUsername() throws IOException {
		return origin.fullUsername();
	}

	@Override
	public String hashedPassword() throws IOException {
		return origin.hashedPassword();
	}

	@Override
	public boolean isLocked() throws IOException {
		return origin.isLocked();
	}

	@Override
	public String salt() throws IOException {
		return origin.salt();
	}

	@Override
	public Profile profile() throws IOException {
		return origin.profile();
	}

	@Override
	public void changeProfile(Profile profile) throws IOException {
		origin.changeProfile(profile); 
	}

	@Override
	public void changePassword(String newPassword, String oldPassword) throws IOException {
		origin.changePassword(newPassword, oldPassword);
	}

	@Override
	public void initPassword() throws IOException {
		origin.initPassword(); 
	}

	@Override
	public void lock(boolean isLock) throws IOException {
		origin.lock(isLock);
	}

	@Override
	public boolean matchToPassword(String password) throws IOException {
		return origin.matchToPassword(password);
	}

	@Override
	public boolean matchToHashedPassword(String password) throws IOException {
		return origin.matchToHashedPassword(password);
	}

	@Override
	public String generateToken() throws IOException {
		return origin.generateToken();
	}

	@Override
	public List<Module> modules() throws IOException {
		return origin.modules();
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}
	
	@Override
	public boolean equals(Object object){
		return origin.equals(object);
	}
}
