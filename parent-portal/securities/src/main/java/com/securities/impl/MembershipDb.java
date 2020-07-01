package com.securities.impl;

import java.io.IOException;
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
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Admin;
import com.securities.api.ContactMetadata;
import com.securities.api.ContactPerson;
import com.securities.api.Encryption;
import com.securities.api.Membership;
import com.securities.api.Profile;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public final class MembershipDb extends AdvancedQueryableDb<User, UUID, UserMetadata> implements Membership {
	
	private final transient Encryption encryption;
	private final transient Admin moduleAdmin;
	private transient final String defaultUsername = "admin";
	private final transient UseCode useCode;
	
	public MembershipDb(final Base base, final Admin moduleAdmin, UseCode useCode) {
		super(base, "Utilisateur introuvable !");
		
		this.encryption = new EncryptionImpl();
		this.moduleAdmin = moduleAdmin;
		this.useCode = useCode;
	}

	@Override
	public User user(String username) throws IOException {
		
		if(StringUtils.isBlank(username))
			throw new IllegalArgumentException("Vous devez renseigner le pseudo de l'utilisateur !");
		
		ContactMetadata vctcDm = ContactMetadata.create();
		String statement = String.format("SELECT util.%s FROM %s util "
				+ "JOIN view_contacts vctc ON vctc.%s=util.%s "
				+ "WHERE util.%s=? AND vctc.%s=?", 
				dm.keyName(), dm.domainName(), 
				vctcDm.keyName(), dm.keyName(),
				dm.usernameKey(), vctcDm.companyIdKey());
		
		List<Object> values = base.executeQuery(statement, Arrays.asList(username.trim(), moduleAdmin.company().id()));
		
		if(values.isEmpty())
			throw new IllegalArgumentException(msgNotFound);
		
		return build(UUIDConvert.fromObject(values.get(0)));
	}

	@Override
	public User register(ContactPerson person, String username, Profile profile) throws IOException {
		
		if(person.id() == null)
			throw new IllegalArgumentException("L'identité de l'utilisateur doit être définie !");
		
		if(StringUtils.isBlank(username))
			throw new IllegalArgumentException("Le pseudo de l'utilisateur doit être renseigné !");
		
		if(profile.id() == null)
			throw new IllegalArgumentException("Le profil de l'utilisateur doit être renseigné !");	
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.usernameKey(), username);
		params.put(dm.profileIdKey(), profile.id());
		
		String salt = encryption.createSalt();
		params.put(dm.saltKey(), salt);
		params.put(dm.hashedPasswordKey(), encryption.encryptPassword(username, salt));
		
		ds.set(person.id(), params);
		
		return build(person.id());
	}

	@Override
	public User defaultUser() throws IOException {
		ContactPerson person = moduleAdmin.contacts().adminPerson();
		User user = build(person.id());
		
		if(user.isNone())
			return register(person, defaultUsername, moduleAdmin.profiles().superAdministratorProfile());
		
		return user;
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s util "
				+ "JOIN view_contacts vctc ON vctc.id=util.%s "
				+ "WHERE (vctc.name1 ILIKE ? OR vctc.name2 ILIKE ?) AND vctc.companyid=?",
				dm.domainName(), dm.keyName());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(moduleAdmin.company().id());
		
		if(useCode != UseCode.NONE){
			ContactMetadata vctcDm = ContactMetadata.create();
			statement = String.format("%s AND vctc.%s=?", statement, vctcDm.useCodeIdKey());
			params.add(useCode.id());
		}
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String orderClause = String.format("ORDER BY util.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("util.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected User newOne(UUID id) {
		return new UserDb(base, new ContactPersonDb(base, id));
	}

	@Override
	public User none() {
		return new UserNone();
	}

	@Override
	public Membership withUseCode(UseCode useCode) throws IOException {
		return new MembershipDb(base, moduleAdmin, useCode);
	}

	@Override
	public boolean contains(String username) throws IOException {
		try {
			user(username);
			return true;
		} catch (IllegalArgumentException e) {
			return false;
		}
	}
}
