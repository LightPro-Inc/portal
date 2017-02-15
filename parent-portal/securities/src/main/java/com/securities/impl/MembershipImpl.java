package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Company;
import com.securities.api.Encryption;
import com.securities.api.Membership;
import com.securities.api.MembershipContext;
import com.securities.api.Person;
import com.securities.api.PersonMetadata;
import com.securities.api.Persons;
import com.securities.api.Profile;
import com.securities.api.Sex;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public class MembershipImpl implements Membership {
	
	private final transient Base base;
	private final transient UserMetadata dm;
	private final transient PersonMetadata persDm;
	private final transient Encryption encryption;
	private final transient Persons persons;
	private final transient DomainsStore ds;
	private final transient Company company;
	
	public MembershipImpl(final Base base, final Company company) {
		this.base = base;
		this.dm = UserImpl.dm();
		this.persDm = PersonImpl.dm();
		this.encryption = new EncryptionImpl();
		this.persons = new PersonsImpl(base, company);
		this.ds = base.domainsStore(dm);
		this.company = company;
	}
	
	@Override
	public User register(String firstName, String lastName, Sex sex, String address, LocalDate birthDate, String tel1, String tel2, String email, String photo, String username, Profile profile) throws IOException {
					
		Person person = persons.add(firstName, lastName, sex, address, birthDate, tel1, tel2, email, photo);
		
		// Enregistrer sa fonction d'utilisateur
		return register(person, username, profile);
	}

	@Override
	public MembershipContext validateUser(String username, String password) throws IOException {
				
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.usernameKey());
		List<Object> results = this.base.domainsStore(dm).find(statement, Arrays.asList(username));
		
		MembershipContext context = null;
		
		if(!results.isEmpty()) {
			User user = new UserImpl(this.base, UUIDConvert.fromObject(results.get(0)));
			
			if(user.hashedPassword().equals(encryption.encryptPassword(password, user.salt())) && !user.isLocked()) {
				context = new MembershipContext(user, encryption);
			}
		}
		
		return context;
	}

	@Override
	public User get(UUID id) throws IOException {
		
		if(!base.domainsStore(dm).exists(id))
			throw new IllegalArgumentException("User not found !");
		
		return new UserImpl(base, id);
	}

	@Override
	public User get(String username) throws IOException {
		
		if(StringUtils.isBlank(username))
			throw new IllegalArgumentException("Invalid username !");
		
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.usernameKey());
		List<Object> values = base.executeQuery(statement, Arrays.asList(username));
		
		if(values.isEmpty())
			throw new IllegalArgumentException("User not found !");
		
		return new UserImpl(base, UUIDConvert.fromObject(values.get(0)));
	}

	private String username(String fullUsername) throws IOException {
		String[] usernameParts = fullUsername.split("@");
		return usernameParts[0];
	}
	@Override
	public MembershipContext validateUserByFullUserName(String fullUsername, String password) throws IOException {				
		return validateUser(username(fullUsername), password);
	}

	@Override
	public User getByFullUsername(String fullUsername) throws IOException {
		return get(username(fullUsername));
	}

	@Override
	public void changePassword(String username, String newPassword, String oldPassword) throws IOException {
				
		if(newPassword.equals(oldPassword))
			throw new IllegalArgumentException("Le nouveau mot de passe est identique à l'ancien !");
		
		MembershipContext context = validateUser(username, oldPassword);
		
		if(context == null)
			throw new IllegalArgumentException("L'ancien mot de passe ne correspond pas !");
		
		DomainStore ds = base.domainsStore(dm).createDs(context.userId());
		ds.set(dm.hashedPasswordKey(), encryption.encryptPassword(newPassword, context.user().salt()));
	}

	@Override
	public void changePasswordByFullUsername(String fullUsername, String newPassword, String oldPassword) throws IOException {
		changePassword(username(fullUsername), newPassword, oldPassword);		
	}

	@Override
	public List<User> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<User> find(int page, int pageSize, String filter) throws IOException {

		String statement = String.format("SELECT %s FROM %s "
				+ "WHERE %s IN (SELECT %s FROM %s WHERE (concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ?) AND %s=?) "
				+ "AND %s ILIKE ? "
				+ "ORDER BY %s DESC LIMIT ? OFFSET ?", 
				dm.keyName(), dm.domainName(), 
				dm.keyName(), persDm.keyName(), persDm.domainName(), persDm.firstNameKey(), persDm.lastNameKey(), persDm.lastNameKey(), persDm.firstNameKey(), persDm.companyIdKey(),
				dm.usernameKey(), 
				HorodateImpl.dm().dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company.id());
		params.add("%" + filter + "%");		
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		return ds.find(statement, params)
				 .stream()
				 .map(m -> build(UUIDConvert.fromObject(m)))
				 .collect(Collectors.toList());
	}

	@Override
	public int totalCount(String filter) throws IOException {
		
		String statement = String.format("SELECT COUNT(%s) FROM %s "
				+ "WHERE %s IN (SELECT %s FROM %s WHERE (concat(%s,' ', %s) ILIKE ?  OR concat(%s, ' ', %s) ILIKE ?) AND %s=?) "
				+ "AND %s ILIKE ? ",
				dm.keyName(), dm.domainName(), 
				dm.keyName(), persDm.keyName(), persDm.domainName(), persDm.firstNameKey(), persDm.lastNameKey(), persDm.lastNameKey(), persDm.firstNameKey(), persDm.companyIdKey(), 
				dm.usernameKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(company.id());
		params.add("%" + filter + "%");		
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());	
	}

	@Override
	public List<User> all() throws IOException {
		return find(0, 0, "");
	}

	@Override
	public boolean contains(User item) {
		try {
			return item.isPresent() && item.company().isEqual(company);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public User build(UUID id) {
		return new UserImpl(this.base, id);
	}

	@Override
	public void delete(User item) throws IOException {
		if(contains(item))
			ds.delete(item.id());
	}

	@Override
	public void initPassword(User user) throws IOException {
		DomainStore ds = base.domainsStore(dm).createDs(user.id());
		ds.set(dm.hashedPasswordKey(), encryption.encryptPassword(user.username(), user.salt()));
	}

	@Override
	public void lock(User user, boolean isLock) throws IOException {
		DomainStore ds = base.domainsStore(dm).createDs(user.id());
		ds.set(dm.isLockedKey(), isLock);
	}

	@Override
	public User register(Person person, String username, Profile profile) throws IOException {
		
		if(StringUtils.isBlank(username))
			throw new IllegalArgumentException("Le pseudo de l'utilisateur doit être renseigné !");
		
		if(!profile.isPresent())
			throw new IllegalArgumentException("Le profil de l'utilisateur doit être renseigné !");	
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.usernameKey(), username);
		params.put(dm.profileIdKey(), profile.id());
		
		String salt = encryption.createSalt();
		params.put(dm.saltKey(), salt);
		params.put(dm.hashedPasswordKey(), encryption.encryptPassword(username, salt));
		
		ds.set(person.id(), params);
		
		return new UserImpl(this.base, person.id());
	}
}
