package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Persons;
import com.securities.api.Sex;

public class PersonsImpl implements Persons {

	private final transient Base base;
	private final transient PersonMetadata dm;
	private final transient DomainsStore ds;
	
	public PersonsImpl(final Base base){
		this.base = base;		
		this.dm = PersonImpl.dm();
		this.ds = base.domainsStore(dm);
	}
	
	@Override
	public List<Person> all() throws IOException {
		return find(0, 0, "");
	}	

	@Override
	public List<Person> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<Person> find(int page, int pageSize, String filter) throws IOException {
		List<Person> values = new ArrayList<Person>();
			
		String statement = String.format("SELECT %s FROM %s WHERE concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ? ORDER BY %s DESC LIMIT ? OFFSET ?", dm.keyName(), dm.domainName(), dm.firstNameKey(), dm.lastNameKey(), dm.lastNameKey(), dm.firstNameKey(), HorodateImpl.dm().dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		List<DomainStore> results = ds.findDs(statement, params);
		for (DomainStore domainStore : results) {
			values.add(new PersonImpl(this.base, domainStore.key())); 
		}		
		
		return values;
	}

	@Override
	public int totalCount(String filter) throws IOException {		
		String statement = String.format("SELECT COUNT(%s) FROM %s WHERE concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ?", dm.keyName(), dm.domainName(), dm.firstNameKey(), dm.lastNameKey(), dm.lastNameKey(), dm.firstNameKey());
		
		List<Object> params = new ArrayList<Object>();
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());			
	}

	@Override
	public boolean contains(Person item) throws IOException {
		return ds.exists(item.id());
	}

	@Override
	public Person build(Object id) {
		return new PersonImpl(this.base, id);
	}

	@Override
	public void delete(Person item) throws IOException {
		ds.delete(item.id());
	}

	@Override
	public Person get(UUID id) throws IOException {
		Person item = build(id);
		
		if(!item.isPresent())
			throw new NotFoundException("La personne n'a pas été trouvé !");
		
		return item;
	}

	@Override
	public Person add(String firstName, String lastName, Sex sex, String address, Date birthDate, String tel1, String tel2, String email, String photo) throws IOException {
		
		if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("Invalid firstName : it can't be empty!");
        }
		
		if (lastName == null || lastName.isEmpty()) {
            throw new IllegalArgumentException("Invalid lastName : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.firstNameKey(), firstName);
		params.put(dm.lastNameKey(), lastName);
		params.put(dm.sexKey(), sex.name());
		params.put(dm.addressKey(), address);
		params.put(dm.birthDateKey(), birthDate);
		params.put(dm.tel1Key(), tel1);
		params.put(dm.tel2Key(), tel2);
		params.put(dm.emailKey(), email);
		params.put(dm.photoKey(), photo);
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}
}
