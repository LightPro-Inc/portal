package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Company;
import com.securities.api.Profile;
import com.securities.api.ProfileMetadata;
import com.securities.api.Profiles;

public class ProfilesImpl implements Profiles {

	private final transient Base base;
	private final transient ProfileMetadata dm;
	private final transient DomainsStore ds;
	private final transient Company company;
	
	public ProfilesImpl(final Base base, final Company company){
		this.base = base;
		this.dm = ProfileMetadata.create();
		this.ds = base.domainsStore(dm);
		this.company = company;
	}
	
	@Override
	public List<Profile> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<Profile> find(int page, int pageSize, String filter) throws IOException {

		HorodateMetadata hm = HorodateImpl.dm();
		String statement = String.format("SELECT %s FROM %s WHERE %s ILIKE ? AND %s=? ORDER BY %s DESC LIMIT ? OFFSET ?", dm.keyName(), dm.domainName(), dm.nameKey(), dm.companyIdKey(), hm.dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add(company.id());
		
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
		String statement = String.format("SELECT COUNT(%s) FROM %s WHERE %s ILIKE ? AND %s=? ", dm.keyName(), dm.domainName(), dm.nameKey(), dm.companyIdKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add(company.id());
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());
	}

	@Override
	public Profile get(UUID id) throws IOException {
		Profile item = build(id);
		
		if(!contains(item))
			throw new NotFoundException("Le profil n'a pas été trouvé !");
		
		return build(id);
	}

	@Override
	public List<Profile> all() throws IOException {
		return find(0, 0, "");
	}

	@Override
	public boolean contains(Profile item) {
		try {
			return item.isPresent() && item.company().isEqual(company);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public Profile build(UUID id) {
		return new ProfileImpl(this.base, id);
	}

	@Override
	public void delete(Profile item) throws IOException {
		if(contains(item))
			ds.delete(item.id());
	}

	@Override
	public Profile add(String name) throws IOException {
		
		if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.companyIdKey(), company.id());
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);		
		
		return build(id);
	}
}
