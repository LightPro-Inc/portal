package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Membership;
import com.securities.api.MembershipContext;
import com.securities.api.PersonMetadata;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public class MembershipImpl implements Membership {
	
	private final transient Base base;
	private final transient PersonMetadata personDm;
	private final transient UserMetadata userDm;
	
	public MembershipImpl(final Base base) {
		this.base = base;
		this.personDm = PersonImpl.dm();
		this.userDm = UserImpl.dm();
	}
	
	@Override
	public User register(String firstName, String lastName, String username, String password) throws IOException {
		
		if (firstName.isEmpty() || lastName.isEmpty()) {
            throw new IllegalArgumentException("Invalid firstName or lastName : they couldn't be empty!");
        }
		
		// 1 - enregistrer la personne
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(personDm.firstNameKey(), firstName);
		params.put(personDm.lastNameKey(), lastName);
		
		UUID id = UUID.randomUUID();
		this.base.domainsStore(personDm).set(id, params);
				
		// 2 - enregistrer sa fonction d'utilisateur
		params = new HashMap<String, Object>();
		params.put(userDm.usernameKey(), username);
		params.put(userDm.hashedPasswordKey(), password);
		
		this.base.domainsStore(userDm).set(id, params);
		
		return new UserImpl(this.base, id);		
	}

	@Override
	public MembershipContext validateUser(String username, String password) throws IOException {
		
		MembershipContext value = null;
		
		List<Object> params = new ArrayList<Object>();
		params.add(username);
		params.add(password);
		
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", userDm.keyName(), userDm.domainName(), userDm.usernameKey(), userDm.hashedPasswordKey());
		List<DomainStore> results = this.base.domainsStore(userDm).findDs(statement, params);
		
		if(results.isEmpty())
			value = new MembershipContext(null);
		else
			value = new MembershipContext(new UserImpl(this.base, results.get(0).key()));
		
		return value;
	}

	@Override
	public User get(Object id) throws IOException {
		return new UserImpl(base, id);
	}
}
