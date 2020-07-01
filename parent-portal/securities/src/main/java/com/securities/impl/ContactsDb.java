package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.UseCode;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Contact;
import com.securities.api.ContactMetadata;
import com.securities.api.ContactNature;
import com.securities.api.ContactPerson;
import com.securities.api.ContactPersonMetadata;
import com.securities.api.ContactRole;
import com.securities.api.ContactSociety;
import com.securities.api.ContactSocietyMetadata;
import com.securities.api.Contacts;
import com.securities.api.PersonNaming;
import com.securities.api.Sex;
import com.securities.api.UserMetadata;

public final class ContactsDb extends AdvancedQueryableDb<Contact, UUID, ContactMetadata> implements Contacts {

	private transient final Company company;
	private transient final ContactNature nature;
	private transient final ContactRole role;
	private transient final UseCode useCode;
	private transient final ContactPersonMetadata dmP;
	private transient final DomainsStore dsP;
	private transient final ContactSocietyMetadata dmS;
	private transient final DomainsStore dsS;
	
	public ContactsDb(final Base base, final Company company, final ContactNature nature, final ContactRole role, final UseCode useCode) {
		super(base, "Le contact recherché n'a pas été trouvé !");
		
		this.company = company;
		this.nature = nature;
		this.role = role;
		this.useCode = useCode;
		
		dmP = ContactPersonMetadata.create();
		dsP = base.domainsStore(dmP);
		dmS = ContactSocietyMetadata.create();
		dsS = base.domainsStore(dmS);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		UserMetadata userDm = UserMetadata.create();
		String statement = String.format("view_contacts vctc "
				+ "LEFT JOIN %s util ON util.%s=vctc.id "
				+ "WHERE (vctc.name1 ILIKE ? OR vctc.name2 ILIKE ?) AND vctc.companyid=?",
				userDm.domainName(), userDm.keyName());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company.id());
		
		if(useCode != UseCode.NONE){
			statement = String.format("%s AND vctc.%s=?", statement, dm.useCodeIdKey());
			params.add(useCode.id());
		}
		
		if(nature != ContactNature.NONE){
			statement = String.format("%s AND vctc.%s=?", statement, dm.natureIdKey());
			params.add(nature.id());
		}
		
		if(role != ContactRole.NONE){
			switch (role) {
			case USER:
				statement = String.format("%s AND util.%s IS NOT NULL", statement, dm.keyName());
				break;
			case NOT_USER:
				statement = String.format("%s AND util.%s IS NULL", statement, dm.keyName());
				break;
			default:
				break;
			}
		}
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String orderClause = String.format("ORDER BY vctc.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("vctc.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected Contact newOne(UUID id) {
		
		ContactNature nature;
		
		try {
			int natureId = base.domainsStore(dm).createDs(id).get(dm.natureIdKey());
			nature = ContactNature.get(natureId);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		
		Contact contact;
		
		switch (nature) {
			case PERSON:
				contact = new ContactPersonDb(base, id);
				break;
			case SOCIETY:
				contact = new ContactSocietyDb(base, id);
				break;
			default:
				throw new IllegalArgumentException("La nature du contact n'est pas déterminée !");
		}
		
		return contact;
	}

	@Override
	public Contact none() {
		return new ContactNone();
	}

	private ContactPerson addPerson(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo, UseCode useCode) throws IOException {
		ContactPersonDb.validate(firstName, lastName, naming, sex);		
		
		Map<String, Object> params = new HashMap<String, Object>();
		
		UUID id = UUID.randomUUID();
		params.put(dm.natureIdKey(), ContactNature.PERSON.id());
		params.put(dm.companyIdKey(), company.id());
		params.put(dm.useCodeIdKey(), useCode.id());
		
		ds.set(id, params);
		
		params = new HashMap<String, Object>();
		params.put(dmP.firstNameKey(), firstName);
		params.put(dmP.lastNameKey(), lastName);
		params.put(dmP.showFullnameModeIdKey(), naming.id());
		params.put(dmP.birthDateKey(), birthDate == null ? null : java.sql.Date.valueOf(birthDate));
		params.put(dmP.birthPlaceKey(), birthPlace);
		params.put(dmP.sexIdKey(), sex.id());
		params.put(dmP.posteOccupeKey(), posteOccupe);
				
		dsP.set(id, params);
		
		return new ContactPersonDb(base, id);
	}
	
	@Override
	public ContactPerson addPerson(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
		return addPerson(firstName, lastName, naming, birthDate, birthPlace, sex, posteOccupe, photo, UseCode.USER);			
	}

	@Override
	public ContactSociety addSociety(String name) throws IOException {
		return addSociety(UUID.randomUUID(), name, UseCode.USER);	
	}
	
	private ContactSociety addSociety(UUID id, String name, UseCode useCode) throws IOException {
				
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put(dm.natureIdKey(), ContactNature.SOCIETY.id());
		params.put(dm.companyIdKey(), company.id());
		params.put(dm.useCodeIdKey(), useCode.id());
		
		ds.set(id, params);
		
		params = new HashMap<String, Object>();		
		params.put(dmS.nameKey(), name);
				
		dsS.set(id, params);
		
		return new ContactSocietyDb(base, id);		
	}

	@Override
	public Contacts of(ContactRole role) throws IOException {
		return new ContactsDb(base, company, nature, role, useCode);
	}

	@Override
	public Contacts of(ContactNature nature) throws IOException {
		return new ContactsDb(base, company, nature, role, useCode);
	}

	@Override
	public ContactPerson person(UUID id) throws IOException {
		Contact contact = get(id);
		
		if(contact.nature() != ContactNature.PERSON)
			throw new IllegalArgumentException("Le contact trouvé n'est pas une personne !");
		
		return (ContactPerson) contact;
	}

	@Override
	public ContactSociety society(UUID id) throws IOException {
		Contact contact = get(id);
		
		if(contact.nature() != ContactNature.SOCIETY)
			throw new IllegalArgumentException("Le contact trouvé n'est pas une société !");
		
		return (ContactSociety) contact;
	}

	@Override
	public ContactPerson buildPerson(UUID id) throws IOException {
		ContactPerson contact;
		
		if(id == null)
			contact = new ContactPersonNone();
		else
			contact = new ContactPersonDb(base, id);
		
		return contact;	
	}

	@Override
	public ContactSociety buildSociety(UUID id) throws IOException {
		ContactSociety contact;
		
		if(id == null)
			contact = new ContactSocietyNone();
		else
			contact = new ContactSocietyDb(base, id);
		
		return contact;
	}
	
	@Override
	public void delete(Contact item) throws IOException {
		if(!contains(item))
			return;
		
		DomainsStore dsI;
		
		switch (item.nature()) {
		case PERSON:
			dsI = dsP;
			break;
		case SOCIETY:
			dsI = dsS;
			break;
		default:
			throw new IllegalArgumentException("La nature du contact n'est pas prise en charge !");
		}
		
		dsI.delete(item.id());
		ds.delete(item.id());
	}

	@Override
	public ContactPerson defaultPerson() throws IOException {
		ContactPerson person;
		
		String statement = String.format("SELECT id FROM view_contacts WHERE %s=? AND %s=? AND %s=?", dm.useCodeIdKey(), dm.companyIdKey(), dm.locationAddressKey());
		
		List<Object> values = base.domainsStore(dm).find(statement, Arrays.asList(UseCode.SYSTEM.id(), company.id(), "ANONYME"));
		if(values.isEmpty())
		{
			person = addPerson("anonyme", "Personne", PersonNaming.FIRST_LAST_NAME, LocalDate.of(1980, 2, 28), company.denomination(), Sex.M, "Poste anonyme", null, UseCode.SYSTEM);
			person.updateAddresses("ANONYME", null, null, null, null, null, null);
		}else
			person = person(UUIDConvert.fromObject(values.get(0)));
		
		return person;
	}

	@Override
	public ContactPerson adminPerson() throws IOException {
		ContactPerson person;
		
		String statement = String.format("SELECT id FROM view_contacts WHERE %s=? AND %s=? AND %s=?", dm.useCodeIdKey(), dm.companyIdKey(), dm.locationAddressKey());
		
		List<Object> values = base.domainsStore(dm).find(statement, Arrays.asList(UseCode.SYSTEM.id(), company.id(), "ADMIN"));
		if(values.isEmpty())
		{
			person = addPerson("Admin", "User", PersonNaming.LAST_FIRST_NAME, LocalDate.of(1980, 2, 28), company.denomination(), Sex.M, "Administrateur", null, UseCode.SYSTEM);
			person.updateAddresses("ADMIN", null, null, null, null, null, null);
		}else
			person = person(UUIDConvert.fromObject(values.get(0)));
		
		return person;
	}
	
	@Override
	public ContactSociety myCompany() throws IOException {
		ContactSociety society;
		
		String statement = String.format("SELECT id FROM view_contacts WHERE %s=? AND %s=?", dm.useCodeIdKey(), dm.keyName());
		
		List<Object> values = base.domainsStore(dm).find(statement, Arrays.asList(UseCode.SYSTEM.id(), company.id()));
		if(values.isEmpty())
		{
			society = addSociety(company.id(), company.denomination(), UseCode.SYSTEM);
			society.updateAddresses(company.siegeSocial(), company.tel(), company.tel(), company.fax(), company.email(), company.bp(), company.webSite());
		} else
		{
			society = society(UUIDConvert.fromObject(values.get(0)));
			society.updateAdministrativeInfos(company.denomination());
			society.updateAddresses(company.siegeSocial(), company.tel(), company.tel(), company.fax(), company.email(), company.bp(), company.webSite());
		}
		
		return society;
	}

	@Override
	public Contacts of(UseCode useCode) throws IOException {
		return new ContactsDb(base, company, nature, role, useCode);
	}
}
