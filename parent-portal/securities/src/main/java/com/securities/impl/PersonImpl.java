package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Sex;

public class PersonImpl implements Person {
	
	private final transient Base base;
	private final transient Object id;
	private final transient PersonMetadata dm;
	private final transient DomainStore ds;
	
	public PersonImpl(Base base, Object id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);		
	}
	
	@Override
	public UUID id() {
		return UUIDConvert.fromObject(this.id);
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
	public String fullName() throws IOException {
		return lastName() + " " + firstName();
	}

	@Override
	public Sex sex() throws IOException {
		String sex = ds.get(dm.sexKey());
		return Sex.valueOf(sex);
	}

	@Override
	public void update(String firstName, String lastName, Sex sex) throws IOException {
		if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("Invalid firstName : it can't be empty!");
        }
		
		if (lastName == null || lastName.isEmpty()) {
            throw new IllegalArgumentException("Invalid lastName : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.firstNameKey(), firstName);
		params.put(dm.lastNameKey(), lastName);
		params.put(dm.sexKey(), sex);
		
		ds.set(params);		
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}
	
	public static PersonMetadata dm(){
		return new PersonMetadata();
	}

	@Override
	public boolean isPresent() throws IOException {
		return base.domainsStore(dm).exists(id);
	}
}
