package com.securities.impl;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Sex;

public class PersonImpl implements Person {
	
	private final transient Base base;
	private final transient UUID id;
	private final transient PersonMetadata dm;
	private final transient DomainStore ds;
	
	public PersonImpl(Base base, UUID id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);		
	}
	
	@Override
	public UUID id() {
		return this.id;
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
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}
	
	public static PersonMetadata dm(){
		return new PersonMetadata();
	}

	@Override
	public boolean isPresent() {
		try {
			return base.domainsStore(dm).exists(id);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public String address() throws IOException {
		return ds.get(dm.addressKey());
	}

	@Override
	public Date birthDate() throws IOException {
		return ds.get(dm.birthDateKey());
	}

	@Override
	public String tel1() throws IOException {
		return ds.get(dm.tel1Key());
	}

	@Override
	public String tel2() throws IOException {
		return ds.get(dm.tel2Key());
	}

	@Override
	public String email() throws IOException {
		return ds.get(dm.emailKey());
	}

	@Override
	public String photo() throws IOException {
		return ds.get(dm.photoKey());
	}

	@Override
	public void update(String firstName, String lastName, Sex sex, String address, Date birthDate, String tel1, String tel2, String email, String photo) throws IOException {
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
		params.put(dm.birthDateKey(), birthDate == null ? null : new java.sql.Timestamp(birthDate.getTime()));
		params.put(dm.tel1Key(), tel1);
		params.put(dm.tel2Key(), tel2);
		params.put(dm.emailKey(), email);
		params.put(dm.photoKey(), photo);
		
		ds.set(params);			
	}

	@Override
	public boolean isEqual(Person item) {
		return this.id().equals(item.id());
	}

	@Override
	public boolean isNotEqual(Person item) {
		return !isEqual(item);
	}
}
