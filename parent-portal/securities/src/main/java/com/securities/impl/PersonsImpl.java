package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Persons;

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
		return (int)results.get(0);			
	}

	@Override
	public boolean contains(Person item) throws IOException {
		return ds.exists(item.id());
	}

	@Override
	public Person build(Object id) {
		return new PersonImpl(this.base, id);
	}
}
