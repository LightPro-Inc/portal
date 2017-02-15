package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Company;
import com.securities.api.Membership;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Persons;
import com.securities.api.Sex;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public class PersonNotUsers implements Persons {

	private final transient Base base;
	private final transient PersonMetadata dm;
	private final transient UserMetadata userDm;
	private final transient Persons origin;
	private final transient Membership membership;
	
	public PersonNotUsers(final Base base, final Persons origin, final Membership membership){
		this.origin = origin;
		this.membership = membership;
		this.base = base;
		this.dm = PersonImpl.dm();
		this.userDm = UserImpl.dm();
	}
	
	@Override
	public List<Person> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<Person> find(int page, int pageSize, String filter) throws IOException {
		
		String statement = String.format("SELECT %s FROM %s "
				+ "WHERE (concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ?) AND %s=? AND %s NOT IN (SELECT %s FROM %s) "
				+ "ORDER BY %s DESC ", 
				dm.keyName(), dm.domainName(), 
				dm.firstNameKey(), dm.lastNameKey(), dm.lastNameKey(), dm.firstNameKey(), dm.companyIdKey(), dm.keyName(), userDm.keyName(), userDm.domainName(),
				HorodateImpl.dm().dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company().id());
		
		DomainsStore ds = base.domainsStore(dm);
		
		return ds.findPagined(statement, params, page, pageSize)
				 .stream()
				 .map(m -> build(UUIDConvert.fromObject(m)))
				 .collect(Collectors.toList());
	}

	@Override
	public int totalCount(String filter) throws IOException {
		
		String statement = String.format("SELECT COUNT(%s) FROM %s "
				+ "WHERE (concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ?) AND %s=? AND %s NOT IN (SELECT %s FROM %s) ",
				dm.keyName(), dm.domainName(), 
				dm.firstNameKey(), dm.lastNameKey(), dm.lastNameKey(), dm.firstNameKey(), dm.companyIdKey(), dm.keyName(), userDm.keyName(), userDm.domainName());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company().id());
		
		DomainsStore ds = base.domainsStore(dm);
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());			
	}

	@Override
	public Person get(UUID id) throws IOException {	
		Person item = build(id);
		
		if(contains(item))
			throw new IllegalArgumentException("La personne n'a pas été trouvée !");
		
		return item;					
	}

	@Override
	public List<Person> all() throws IOException {
		return find(0, 0, "");
	}

	@Override
	public boolean contains(Person item) {
		User user = membership.build(item.id());		
		return !membership.contains(user);
	}

	@Override
	public Person build(UUID id) {
		return origin.build(id);
	}

	@Override
	public void delete(Person item) throws IOException {
		if(contains(item))
			origin.delete(item);		
	}

	@Override
	public Person add(String firstName, String lastName, Sex sex, String address, LocalDate birthDate, String tel1, String tel2, String email, String photo) throws IOException {
		return origin.add(firstName, lastName, sex, address, birthDate, tel1, tel2, email, photo);
	}

	@Override
	public Person defaultPerson() throws IOException {
		return origin.defaultPerson();
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
	}
}
