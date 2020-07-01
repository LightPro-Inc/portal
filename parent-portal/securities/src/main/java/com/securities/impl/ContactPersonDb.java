package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.core.Validatable;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Contact;
import com.securities.api.ContactMetadata;
import com.securities.api.ContactNature;
import com.securities.api.ContactPerson;
import com.securities.api.ContactPersonMetadata;
import com.securities.api.ContactSociety;
import com.securities.api.PersonNaming;
import com.securities.api.Sex;

public final class ContactPersonDb extends GuidKeyEntityDb<Contact, ContactPersonMetadata> implements ContactPerson {

	private final transient DomainStore dsC;
	private final transient ContactMetadata dmC;
	
	public ContactPersonDb(Base base, UUID id) {
		super(base, id, "Personne introuvable !"); 
		this.dmC = ContactMetadata.create();
		this.dsC = this.base.domainsStore(dmC).createDs(id);
	}

	@Override
	public String name() throws IOException {
		String name;
		
		switch (naming()) {
		case FIRST_LAST_NAME:
			name = String.format("%s %s", firstName(), lastName());
			break;
		case LAST_FIRST_NAME:
			name = String.format("%s %s", lastName(), firstName());
			break;
		default:
			name = StringUtils.EMPTY;
			break;
		}

		return name;
	}

	@Override
	public String locationAddress() throws IOException {
		return dsC.get(dmC.locationAddressKey());
	}

	@Override
	public String phone() throws IOException {
		return dsC.get(dmC.phoneKey());
	}

	@Override
	public String mobile() throws IOException {
		return dsC.get(dmC.mobileKey());
	}

	@Override
	public String fax() throws IOException {
		return dsC.get(dmC.faxKey());
	}

	@Override
	public String mail() throws IOException {
		return dsC.get(dmC.mailKey());
	}

	@Override
	public String poBox() throws IOException {
		return dsC.get(dmC.poBoxKey());
	}

	@Override
	public String webSite() throws IOException {
		return dsC.get(dmC.webSiteKey());
	}

	@Override
	public String photo() throws IOException {
		return dsC.get(dmC.photoKey());
	}

	@Override
	public ContactNature nature() throws IOException {
		int natureId = dsC.get(dmC.natureIdKey());
		return ContactNature.get(natureId);
	}

	@Override
	public String firstName() throws IOException {
		return ds.get(dm.firstNameKey());
	}

	@Override
	public String lastName() throws IOException {
		return ds.get(dm.lastNameKey());
	}

	@Override
	public PersonNaming naming() throws IOException {
		int namingId = ds.get(dm.showFullnameModeIdKey());
		return PersonNaming.get(namingId);
	}

	@Override
	public LocalDate birthDate() throws IOException {
		java.sql.Date date = ds.get(dm.birthDateKey());
		
		if(date == null)
			return null;
		
		return date.toLocalDate();
	}

	@Override
	public String birthPlace() throws IOException {
		return ds.get(dm.birthPlaceKey());
	}

	@Override
	public Sex sex() throws IOException {
		int sexId = ds.get(dm.sexIdKey());
		return Sex.get(sexId);
	}

	@Override
	public String posteOccupe() throws IOException {
		return ds.get(dm.posteOccupeKey());
	}

	@Override
	public ContactSociety society() throws IOException {
		UUID societyId = ds.get(dm.societyIdKey());
		return new ContactSocietyDb(base, societyId);
	}

	public static void validate(String firstName, String lastName, PersonNaming naming, Sex sex) throws IOException {
		Validatable validation = new ContactPersonValidation(firstName, lastName, naming, sex);		
		validation.validate();
	}
	
	@Override
	public void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
		
		ContactPersonDb.validate(firstName, lastName, naming, sex);
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.firstNameKey(), firstName);
		params.put(dm.lastNameKey(), lastName);
		params.put(dm.showFullnameModeIdKey(), naming.id());
		params.put(dm.birthDateKey(), birthDate == null ? null : java.sql.Date.valueOf(birthDate));
		params.put(dm.birthPlaceKey(), birthPlace);
		params.put(dm.sexIdKey(), sex.id());
		params.put(dm.posteOccupeKey(), posteOccupe);
		
		ds.set(params);
		
		dsC.set(dmC.photoKey(), photo);
	}

	@Override
	public void changeSociety(ContactSociety society) throws IOException {
		ds.set(dm.societyIdKey(), society.id());
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail, String poBox, String webSite) throws IOException {
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dmC.locationAddressKey(), locationAddress);
		params.put(dmC.phoneKey(), phone);
		params.put(dmC.mobileKey(), mobile);
		params.put(dmC.faxKey(), fax);
		params.put(dmC.mailKey(), mail);
		params.put(dmC.poBoxKey(), poBox);
		params.put(dmC.webSiteKey(), webSite);
		
		dsC.set(params);
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = dsC.get(dmC.companyIdKey());
		return new CompanyDb(base, companyId);
	}
}
