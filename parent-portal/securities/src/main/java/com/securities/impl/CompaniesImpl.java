package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Companies;
import com.securities.api.Company;
import com.securities.api.CompanyMetadata;

public class CompaniesImpl implements Companies {

	private final transient Base base;
	private final transient CompanyMetadata dm;
	private final transient DomainsStore ds;
	
	public CompaniesImpl(final Base base){
		this.base = base;
		this.dm = CompanyMetadata.create();
		this.ds = base.domainsStore(dm);
	}
	
	@Override
	public List<Company> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<Company> find(int page, int pageSize, String filter) throws IOException {
		List<Company> values = new ArrayList<Company>();
		
		HorodateMetadata hm = HorodateImpl.dm();
		String statement = String.format("SELECT %s FROM %s WHERE %s ILIKE ? ORDER BY %s DESC LIMIT ? OFFSET ?", dm.keyName(), dm.domainName(), dm.denominationKey(), hm.dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		List<DomainStore> results = ds.findDs(statement, params);
		for (DomainStore domainStore : results) {
			values.add(build(UUIDConvert.fromObject(domainStore.key()))); 
		}		
		
		return values;
	}

	@Override
	public int totalCount(String filter) throws IOException {
		String statement = String.format("SELECT COUNT(%s) FROM %s WHERE %s ILIKE ?", dm.keyName(), dm.domainName(), dm.denominationKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());	
	}

	@Override
	public Company get(UUID id) throws IOException {	
		
		if(!ds.exists(id))
			throw new NotFoundException("L'entreprise n'a pas été trouvée !");
		
		return build(id);
	}

	@Override
	public List<Company> all() throws IOException {
		return find(0, 0, "");
	}

	@Override
	public boolean contains(Company item) {
		return ds.exists(item.id());
	}

	@Override
	public Company build(UUID id) {
		return new CompanyImpl(this.base, id);
	}
}
