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
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Profile;
import com.securities.api.ProfileMetadata;
import com.securities.api.Profiles;

public class ProfilesDb extends AdvancedQueryableDb<Profile, UUID, ProfileMetadata> implements Profiles {

	private final transient Company company;
	private transient Profile superAdminProfile;
	
	public ProfilesDb(final Base base, final Company company){
		super(base, "Profil introuvable !");
		this.company = company;
	}

	@Override
	public Profile add(String name) throws IOException {		
		return add(name, false);
	}

	@Override
	public Profile superAdministratorProfile() throws IOException {
		
		if(superAdminProfile == null) {
			String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.companyIdKey(), dm.isSuperAdminKey());
			List<Object> results = base.domainsStore(dm).find(statement, Arrays.asList(company.id(), true));;
			
			Profile profile;
			
			if(!results.isEmpty()) {
				profile = new ProfileDb(base, UUIDConvert.fromObject(results.get(0)));				
			} else {
				// créer le profil
				profile = add("Super administrateur", true);
			}
										
			superAdminProfile = new SuperAdminProfileDb(base, profile);
		}				
		
		return superAdminProfile;
	}

	@Override
	public Profile add(String name, boolean isSuperAdmin) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.companyIdKey(), company.id());
		params.put(dm.isSuperAdminKey(), isSuperAdmin);
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);		
		
		return build(id);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s prof "
				+ "WHERE prof.%s ILIKE ? AND prof.%s=?",
				dm.domainName(), 
				dm.nameKey(), dm.companyIdKey());
		
		params.add("%" + filter + "%");
		params.add(company.id());
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String orderClause = String.format("ORDER BY prof.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("prof.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected Profile newOne(UUID id) {	
		try {
			Profile profile = new ProfileDb(base, id);
			if(profile.equals(superAdministratorProfile()))
				profile = superAdministratorProfile();
			
			return profile;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public Profile none() {
		return new ProfileNone();
	}
}
