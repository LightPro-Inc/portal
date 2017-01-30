package com.securities.impl;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Person;
import com.securities.api.Sex;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public class UserImpl implements User {

	private transient final Base base;
	private transient final Person identity;
	private transient final UserMetadata dm;
	private final transient DomainStore ds;
	
	public UserImpl(Base base, UUID id){
		this.base = base;		
		this.identity = new PersonImpl(this.base, id);
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(this.identity.id());		
	}
	
	@Override
	public UUID id() {
		return this.identity.id();
	}

	@Override
	public String firstName() throws IOException {
		return identity.firstName();
	}

	@Override
	public String lastName() throws IOException {
		return identity.lastName();
	}

	@Override
	public String fullName() throws IOException {
		return identity.fullName();
	}

	@Override
	public String username() throws IOException {
		return ds.get(dm.usernameKey());
	}

	@Override
	public String hashedPassword() throws IOException {
		return ds.get(dm.hashedPasswordKey());
	}

	@Override
	public boolean isLocked() throws IOException {
		return ds.get(dm.isLockedKey());
	}

	@Override
	public Sex sex() throws IOException {
		return this.identity.sex();
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}
	
	public static UserMetadata dm(){
		return  new UserMetadata();
	}

	@Override
	public boolean isPresent() {
		try {
			return base.domainsStore(dm).exists(identity.id());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public String address() throws IOException {
		return identity.address();
	}

	@Override
	public Date birthDate() throws IOException {
		return identity.birthDate();
	}

	@Override
	public String tel1() throws IOException {
		return identity.tel1();
	}

	@Override
	public String tel2() throws IOException {
		return identity.tel2();
	}

	@Override
	public String email() throws IOException {
		return identity.email();
	}

	@Override
	public String photo() throws IOException {
		return identity.photo();
	}

	@Override
	public void update(String firstName, String lastName, Sex sex, String address, Date birthDate, String tel1, String tel2, String email, String photo) throws IOException {
		this.identity.update(firstName, lastName, sex, address, birthDate, tel1, tel2, email, photo);	
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
