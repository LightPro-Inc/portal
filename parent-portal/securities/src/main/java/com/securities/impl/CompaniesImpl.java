package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.StringUtils;

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

	@Override
	public Company add(String denomination, 
					   String shortName, 
					   String rccm, 
					   String ncc, 
					   String siegeSocial, 
					   String bp,
					   String tel, 
					   String fax, 
					   String email, 
					   String webSite, 
					   String logo, 
					   String currencyName,
					   String currencyShortName) throws IOException {
		
		if(StringUtils.isBlank(denomination))
			throw new IllegalArgumentException("La dénomination ne doit pas être vide!");
		
		if(StringUtils.isBlank(shortName))
			throw new IllegalArgumentException("Le nom court ne doit être renseigné !");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.denominationKey(), denomination);
		params.put(dm.shortName(), shortName);
		params.put(dm.rccmKey(), rccm);
		params.put(dm.nccKey(), ncc);
		params.put(dm.siegeSocialKey(), siegeSocial);
		params.put(dm.bpKey(), bp);
		params.put(dm.telKey(), tel);
		params.put(dm.faxKey(), fax);
		params.put(dm.emailKey(), email);
		params.put(dm.webSiteKey(), webSite);
		params.put(dm.logoKey(), logo);
		params.put(dm.currencyNameKey(), currencyName);
		params.put(dm.currencyShortName(), currencyShortName);
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	public Company get(String shortName) throws IOException {
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.shortName());
		Optional<Object> idOpt = ds.getFirst(statement, Arrays.asList(shortName));
		
		if(!idOpt.isPresent())
			throw new IllegalArgumentException("L'entreprise n'a pas été trouvée !");
		
		return build(UUIDConvert.fromObject(idOpt.get()));
	}

	@Override
	public boolean isPresent(String shortName) {
		
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.shortName());
		Optional<Object> idOpt;
		
		try {
			idOpt = ds.getFirst(statement, Arrays.asList(shortName));
			return idOpt.isPresent();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
}
