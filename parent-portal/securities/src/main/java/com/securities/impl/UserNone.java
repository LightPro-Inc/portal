package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Company;
import com.securities.api.ContactNature;
import com.securities.api.ContactSociety;
import com.securities.api.Indicators;
import com.securities.api.Module;
import com.securities.api.PersonNaming;
import com.securities.api.Profile;
import com.securities.api.Sex;
import com.securities.api.User;

public final class UserNone extends EntityNone<User, UUID> implements User {

	@Override
	public String firstName() throws IOException {
		return "Inconnu";
	}

	@Override
	public String lastName() throws IOException {
		return "Inconnu";
	}

	@Override
	public PersonNaming naming() throws IOException {
		return PersonNaming.NONE;
	}

	@Override
	public LocalDate birthDate() throws IOException {		
		return null;
	}

	@Override
	public String birthPlace() throws IOException {		
		return null;
	}

	@Override
	public Sex sex() throws IOException {
		return Sex.NONE;
	}

	@Override
	public String posteOccupe() throws IOException {		
		return null;
	}

	@Override
	public ContactSociety society() throws IOException {
		return new ContactSocietyNone();
	}

	@Override
	public void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate,
			String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
	
	}

	@Override
	public void changeSociety(ContactSociety society) throws IOException {
		
	}

	@Override
	public String name() throws IOException {		
		return "Non identifié";
	}

	@Override
	public String locationAddress() throws IOException {		
		return null;
	}

	@Override
	public String phone() throws IOException {		
		return null;
	}

	@Override
	public String mobile() throws IOException {		
		return null;
	}

	@Override
	public String fax() throws IOException {		
		return null;
	}

	@Override
	public String mail() throws IOException {		
		return null;
	}

	@Override
	public String poBox() throws IOException {		
		return null;
	}

	@Override
	public String webSite() throws IOException {		
		return null;
	}

	@Override
	public String photo() throws IOException {		
		return null;
	}

	@Override
	public ContactNature nature() throws IOException {	
		return null;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail,
			String poBox, String webSite) throws IOException {
		
	}

	@Override
	public String username() throws IOException {		
		return null;
	}

	@Override
	public String fullUsername() throws IOException {		
		return null;
	}

	@Override
	public String hashedPassword() throws IOException {		
		return null;
	}

	@Override
	public boolean isLocked() throws IOException {
		return true;
	}

	@Override
	public String salt() throws IOException {
		return null;
	}

	@Override
	public Profile profile() throws IOException {
		return new ProfileNone();
	}

	@Override
	public void changeProfile(Profile profile) throws IOException {

	}

	@Override
	public void changePassword(String newPassword, String oldPassword) throws IOException {
		
	}

	@Override
	public void initPassword() throws IOException {

	}

	@Override
	public void lock(boolean isLock) throws IOException {

	}

	@Override
	public boolean matchToPassword(String password) throws IOException {		
		return false;
	}

	@Override
	public boolean matchToHashedPassword(String password) throws IOException {		
		return false;
	}

	@Override
	public String generateToken() throws IOException {		
		return null;
	}

	@Override
	public List<Module> modules() throws IOException {
		return Arrays.asList();
	}

	@Override
	public Indicators indicators() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}
}
