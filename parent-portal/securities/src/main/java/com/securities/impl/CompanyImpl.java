package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.CompanyMetadata;
import com.securities.api.MesureUnitTypes;
import com.securities.api.MesureUnits;
import com.securities.api.Modules;
import com.securities.api.Persons;
import com.securities.api.Sequences;
import com.securities.api.Taxes;

public class CompanyImpl implements Company {
					
	private final transient Base base;
	private final transient UUID id;
	private final transient CompanyMetadata dm;
	private final transient DomainStore ds;
	
	public CompanyImpl(final Base base, final UUID id) {
		this.base = base;
		this.id = id;
		this.dm = CompanyMetadata.create();
		this.ds = this.base.domainsStore(this.dm).createDs(id);			
	}

	@Override
	public String denomination() throws IOException {
		return ds.get(dm.denominationKey());
	}

	@Override
	public String rccm() throws IOException {
		return ds.get(dm.rccmKey());
	}

	@Override
	public String ncc() throws IOException {
		return ds.get(dm.nccKey());
	}

	@Override
	public String siegeSocial() throws IOException {
		return ds.get(dm.siegeSocialKey());
	}

	@Override
	public String bp() throws IOException {
		return ds.get(dm.bpKey());
	}

	@Override
	public String tel() throws IOException {
		return ds.get(dm.telKey());
	}

	@Override
	public String fax() throws IOException {
		return ds.get(dm.faxKey());
	}

	@Override
	public String email() throws IOException {
		return ds.get(dm.emailKey());
	}

	@Override
	public String webSite() throws IOException {
		return ds.get(dm.webSiteKey());
	}

	@Override
	public String logo() throws IOException {
		return ds.get(dm.logoKey());
	}

	@Override
	public UUID id() {
		return this.id;
	}

	@Override
	public Company update( String denomination, 
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
		
		if(denomination.isEmpty())
			throw new IllegalArgumentException("La dénomination ne doit pas être vide!");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.denominationKey(), denomination);
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
		
		ds.set(params);
		
		return new CompanyImpl(base, id);
	}

	@Override
	public void changeLogo(String logo) throws IOException {
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.logoKey(), logo);
		
		ds.set(params); 
	}

	@Override
	public Modules modules() {
		return new ModulesImpl(this.base, this);
	}

	@Override
	public Persons persons() {
		return new PersonsImpl(this.base, this);
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
	}	

	@Override
	public Sequences sequences() {
		return new SequencesImpl(this.base, this);
	}
	
	@Override
	public MesureUnits mesureUnits() {
		return new MesureUnitsImpl(this.base, this);
	}
	
	@Override
	public MesureUnitTypes mesureUnitTypes() {
		return new MesureUnitTypesImpl();
	}

	@Override
	public boolean isPresent() {
		return base.domainsStore(dm).exists(id);
	}

	@Override
	public Taxes taxes() {
		return new TaxesImpl(this.base, this);
	}

	@Override
	public String currencyName() throws IOException {
		return ds.get(dm.currencyNameKey());
	}

	@Override
	public String currencyShortName() throws IOException {
		return ds.get(dm.currencyShortName());
	}

	@Override
	public boolean isEqual(Company item) {
		return this.id().equals(item.id());
	}

	@Override
	public boolean isNotEqual(Company item) {
		return !isEqual(item);
	}
}
