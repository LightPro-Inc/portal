package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.datasource.Base;
import com.securities.api.Encryption;
import com.securities.api.Membership;
import com.securities.api.MembershipContext;
import com.securities.api.PersonMetadata;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public class MembershipImpl implements Membership {
	
	private final transient Base base;
	private final transient PersonMetadata personDm;
	private final transient UserMetadata userDm;
	private final transient Encryption encryption;
	
	public MembershipImpl(final Base base) {
		this.base = base;
		this.personDm = PersonImpl.dm();
		this.userDm = UserImpl.dm();
		this.encryption = new EncryptionImpl();
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
				
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", userDm.keyName(), userDm.domainName(), userDm.usernameKey());
		List<Object> results = this.base.domainsStore(userDm).find(statement, Arrays.asList(username));
		
		MembershipContext value = new MembershipContext(null);
		
		if(!results.isEmpty()) {
			User user = new UserImpl(this.base, UUIDConvert.fromObject(results.get(0)));
			if(user.hashedPassword().equals(encryption.encryptPassword(password, user.salt())))
				value = new MembershipContext(user);
		}
		
		return value;
	}

	@Override
	public User get(UUID id) throws IOException {
		
		if(!base.domainsStore(userDm).exists(id))
			throw new IllegalArgumentException("User not found !");
		
		return new UserImpl(base, id);
	}

	@Override
	public User get(String username) throws IOException {
		
		if(StringUtils.isBlank(username))
			throw new IllegalArgumentException("Invalid username !");
		
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", userDm.keyName(), userDm.domainName(), userDm.usernameKey());
		List<Object> values = base.executeQuery(statement, Arrays.asList(username));
		
		if(values.isEmpty())
			throw new IllegalArgumentException("User not found !");
		
		return new UserImpl(base, UUIDConvert.fromObject(values.get(0)));
	}
}
