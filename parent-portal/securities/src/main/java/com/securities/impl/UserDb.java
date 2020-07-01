package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.ContactNature;
import com.securities.api.ContactPerson;
import com.securities.api.ContactSociety;
import com.securities.api.Encryption;
import com.securities.api.FeatureMetadata;
import com.securities.api.Indicators;
import com.securities.api.Module;
import com.securities.api.ModuleProposedMetadata;
import com.securities.api.ModuleType;
import com.securities.api.PersonNaming;
import com.securities.api.Profile;
import com.securities.api.ProfileFeatureMetadata;
import com.securities.api.Sex;
import com.securities.api.User;
import com.securities.api.UserMetadata;

public final class UserDb extends GuidKeyEntityDb<User, UserMetadata> implements User {

	private transient final ContactPerson origin;
	private final transient Encryption encryption;
	
	public UserDb(Base base, ContactPerson origin){		
		super(base, origin.id(), "Utilisateur introuvable !");
		
		this.origin = origin;
		this.encryption = new EncryptionImpl();
	}
	
	@Override
	public UUID id() {
		return origin.id();
	}

	@Override
	public String firstName() throws IOException {
		return origin.firstName();
	}

	@Override
	public String lastName() throws IOException {
		return origin.lastName();
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
		return origin.sex();
	}

	@Override
	public LocalDate birthDate() throws IOException {
		return origin.birthDate();
	}

	@Override
	public String photo() throws IOException {
		return origin.photo();
	}

	@Override
	public String salt() throws IOException {
		return ds.get(dm.saltKey());
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
	}

	@Override
	public String fullUsername() throws IOException {
		return String.format("%s@%s", username(), company().shortName());
	}

	@Override
	public Profile profile() throws IOException {
		
		UUID profileId = ds.get(dm.profileIdKey());
		Profile profile = new ProfileDb(base, profileId);
		
		if(profile.isSuperAdmin())
			profile = new SuperAdminProfileDb(base, profile);
		
		return profile;
	}

	@Override
	public void changeProfile(Profile profile) throws IOException {
		
		if(profile.id() == null)
			throw new IllegalArgumentException("Le nouveau profil de l'utilisateur doit être renseigné !");	
		
		if(profile.equals(profile()))
			return;
		
		ds.set(dm.profileIdKey(), profile.id());
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public String locationAddress() throws IOException {
		return origin.locationAddress();
	}

	@Override
	public String phone() throws IOException {
		return origin.phone();
	}

	@Override
	public String mobile() throws IOException {
		return origin.mobile();
	}

	@Override
	public String fax() throws IOException {
		return origin.fax();
	}

	@Override
	public String mail() throws IOException {
		return origin.mail();
	}

	@Override
	public String poBox() throws IOException {
		return origin.poBox();
	}

	@Override
	public String webSite() throws IOException {
		return origin.webSite();
	}

	@Override
	public ContactNature nature() throws IOException {
		return origin.nature();
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail, String poBox, String webSite) throws IOException {
		origin.updateAddresses(locationAddress, phone, mobile, fax, mail, poBox, webSite);		
	}

	@Override
	public PersonNaming naming() throws IOException {
		return origin.naming();
	}

	@Override
	public String birthPlace() throws IOException {
		return origin.birthPlace();
	}

	@Override
	public String posteOccupe() throws IOException {
		return origin.posteOccupe();
	}

	@Override
	public ContactSociety society() throws IOException {
		return origin.society();
	}

	@Override
	public void updatePersonalInfos(String firstName, String lastName, PersonNaming naming, LocalDate birthDate, String birthPlace, Sex sex, String posteOccupe, String photo) throws IOException {
		origin.updatePersonalInfos(firstName, lastName, naming, birthDate, birthPlace, sex, posteOccupe, photo); 
	}

	@Override
	public void changeSociety(ContactSociety society) throws IOException {
		origin.changeSociety(society);
	}

	@Override
	public void changePassword(String newPassword, String oldPassword) throws IOException {
		
		if(newPassword.equals(oldPassword))
			throw new IllegalArgumentException("Le nouveau mot de passe ne doit pas être identique à l'ancien !");
				
		if(!matchToPassword(oldPassword))
			throw new IllegalArgumentException("L'ancien mot de passe doit être identique au mot de passe courant !");
		
		ds.set(dm.hashedPasswordKey(), encryption.encryptPassword(newPassword, salt()));
	}

	@Override
	public void initPassword() throws IOException {
		ds.set(dm.hashedPasswordKey(), encryption.encryptPassword(username(), salt()));
	}

	@Override
	public void lock(boolean isLock) throws IOException {
		ds.set(dm.isLockedKey(), isLock);
	}

	@Override
	public String generateToken() throws IOException {
		return encryption.generateToken(username(), id(), hashedPassword(), company().id());
	}

	@Override
	public boolean matchToPassword(String password) throws IOException {
		String hashedPassword = encryption.encryptPassword(password, salt());
		return hashedPassword().equals(hashedPassword);
	}

	@Override
	public boolean matchToHashedPassword(String password) throws IOException {
		return hashedPassword().equals(password);
	}

	@Override
	public List<Module> modules() throws IOException {
		
		ModuleProposedMetadata modDm = ModuleProposedMetadata.create();
		ProfileFeatureMetadata pftDm = ProfileFeatureMetadata.create();
		FeatureMetadata ftDm = FeatureMetadata.create();
		
		String statement = String.format("SELECT mod.%s FROM %s mod "
										+ "WHERE mod.%s IN "
										+ "(SELECT ft.%s FROM %s ft "
										+ "JOIN %s pft ON pft.%s=ft.%s "
										+ "WHERE pft.%s=?)", 
										modDm.keyName(), modDm.domainName(),
										modDm.keyName(),
									    ftDm.moduleTypeIdKey(), ftDm.domainName(),
									    pftDm.domainName(), pftDm.featureIdKey(), ftDm.keyName(),
									    pftDm.profileIdKey());
		
		List<ModuleType> results = base.domainsStore(modDm)
									.find(statement, Arrays.asList(profile().id()))
									.stream()
									.map(m -> ModuleType.get(Integer.parseInt(m.toString())))
									.collect(Collectors.toList());
		
		Company company = company();
		List<Module> modules = new ArrayList<Module>();
		for (ModuleType type : results) {
			modules.add(company.modulesProposed().get(type));
		}
		
		return modules;
	}

	@Override
	public Indicators indicators() throws IOException {
		return new IndicatorsDb(base, ModuleType.NONE, this);
	}
}
