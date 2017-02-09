package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Company;
import com.securities.api.Module;
import com.securities.api.ModuleInstalledMetadata;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;

public class BasisModule implements Module {

	private final transient Base base;	
	private final transient UUID id;
	private final transient ModuleInstalledMetadata dmInst;
	private final transient ModuleSubscribedMetadata dmSub;
	private final transient DomainStore dsSub;
	
	public BasisModule(final Base base, final UUID id){
		this.base = base;
		this.id = id;
		this.dmInst = ModuleInstalledMetadata.create();
		this.dmSub = ModuleSubscribedMetadata.create();
		this.dsSub = base.domainsStore(dmSub).createDs(id);
	}
	
	@Override
	public UUID id() {
		return id;
	}

	@Override
	public String name() throws IOException {
		return type().toString();
	}

	@Override
	public String description() throws IOException {
		return type().description();
	}

	@Override
	public void install() throws IOException {
		throw new UnsupportedOperationException("#install()");
	}

	@Override
	public void uninstall() throws IOException {
		throw new UnsupportedOperationException("#uninstall()");	
	}

	@Override
	public boolean isPresent() {
		return id() != null;
	}

	@Override
	public boolean isEqual(Module item) {
		try {
			return this.id().equals(item.id()) && type() == item.type();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public boolean isNotEqual(Module item) {
		return !isEqual(item);
	}

	@Override
	public ModuleType type() throws IOException {
		int typeId = dsSub.get(dmSub.typeIdKey());
		return ModuleType.get(typeId);
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = dsSub.get(dmSub.companyIdKey());
		return new CompanyImpl(base, companyId);
	}

	@Override
	public boolean isInstalled() {
		return isPresent();
	}

	@Override
	public boolean isSubscribed() {
		
		try {
			String statement = String.format("SELECT COUNT(%s) FROM %s WHERE %s=? AND %s=?", dmSub.keyName(), dmSub.domainName(), dmSub.companyIdKey(), dmSub.typeIdKey());
			List<Object> values = base.executeQuery(statement, Arrays.asList(company().id(), type().id()));
			return Integer.parseInt(values.get(0).toString()) > 0;
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return false;
	}

	@Override
	public boolean isAvailable() {
		return isSubscribed() && !isInstalled();
	}

	@Override
	public Horodate horodate() {
		if(this.isPresent())
			return new HorodateImpl(base.domainsStore(dmInst).createDs(id()));
		else
			return null;
	}

	@Override
	public int order() throws IOException {
		return type().order();
	}

	@Override
	public String shortName() throws IOException {
		return type().shortName();
	}
}
