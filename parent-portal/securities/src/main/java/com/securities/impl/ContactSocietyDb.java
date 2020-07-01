package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Contact;
import com.securities.api.ContactMetadata;
import com.securities.api.ContactNature;
import com.securities.api.ContactSociety;
import com.securities.api.ContactSocietyMetadata;

public final class ContactSocietyDb extends GuidKeyEntityDb<Contact, ContactSocietyMetadata> implements ContactSociety {

	private final transient DomainStore dsC;
	private final transient ContactMetadata dmC;
	
	public ContactSocietyDb(Base base, UUID id) {
		super(base, id, "Société introuvable !");
		this.dmC = ContactMetadata.create();
		this.dsC = this.base.domainsStore(dmC).createDs(id);			
	}	

	@Override
	public String locationAddress() throws IOException {
		return dsC.get(dmC.locationAddressKey());
	}

	@Override
	public String phone() throws IOException {
		return dsC.get(dmC.phoneKey());
	}

	@Override
	public String mobile() throws IOException {
		return dsC.get(dmC.mobileKey());
	}

	@Override
	public String fax() throws IOException {
		return dsC.get(dmC.faxKey());
	}

	@Override
	public String mail() throws IOException {
		return dsC.get(dmC.mailKey());
	}

	@Override
	public String poBox() throws IOException {
		return dsC.get(dmC.poBoxKey());
	}

	@Override
	public String webSite() throws IOException {
		return dsC.get(dmC.webSiteKey());
	}

	@Override
	public String photo() throws IOException {
		return dsC.get(dmC.photoKey());
	}

	@Override
	public ContactNature nature() throws IOException {
		int natureId = dsC.get(dmC.natureIdKey());
		return ContactNature.get(natureId);
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public void updateAddresses(String locationAddress, String phone, String mobile, String fax, String mail, String poBox, String webSite) throws IOException {
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dmC.locationAddressKey(), locationAddress);
		params.put(dmC.phoneKey(), phone);
		params.put(dmC.mobileKey(), mobile);
		params.put(dmC.faxKey(), fax);
		params.put(dmC.mailKey(), mail);
		params.put(dmC.poBoxKey(), poBox);
		params.put(dmC.webSiteKey(), webSite);
		
		dsC.set(params);
	}

	@Override
	public void updateAdministrativeInfos(String name) throws IOException {
		ds.set(dm.nameKey(), name);
	}

	@Override
	public Company company() throws IOException {
		return dsC.get(dmC.companyIdKey());
	}
}
