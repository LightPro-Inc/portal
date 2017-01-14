package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Module;
import com.securities.api.ModuleMetadata;

public class ModuleImpl implements Module {

	private final transient Base base;
	private final transient Object id;
	private final transient ModuleMetadata dm;
	private final transient DomainStore ds;
	
	public ModuleImpl(Base base, Object id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);	
	}
	
	@Override
	public String id() {
		return id.toString();
	}

	@Override
	public String name() throws IOException {
		return this.ds.get(dm.nameKey());
	}

	@Override
	public String description() throws IOException {
		return this.ds.get(dm.descriptionKey());
	}

	@Override
	public void install() throws IOException {
		
		HorodateMetadata hm = HorodateImpl.dm();
		String statement = String.format("INSERT INTO modules_installed (%s, %s, %s, %s, %s, %s) VALUES (?, ?, ?, ?, ?, ?)", hm.dateCreatedKey(), hm.ownerIdKey(), hm.lastModifierIdKey(), hm.lastModifiedDateKey(), "activated", dm.keyName());
		
		List<Object> params = new ArrayList<Object>();
		Date now = new Date();
		
		params.add(new java.sql.Date(now.getTime()));
		params.add(UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985"));
		params.add(UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985"));
		params.add(new java.sql.Date(now.getTime()));		
		params.add(true);
		params.add(this.id);
		
		this.base.domainsStore(this.dm).execute(statement, params);		
	}

	@Override
	public void uninstall() throws IOException {
		String statement = String.format("DELETE FROM modules_installed WHERE id=?");
		
		List<Object> params = new ArrayList<Object>();
		params.add(this.id);
		
		this.base.domainsStore(this.dm).execute(statement, params);			
	}

	@Override
	public String url() throws IOException {
		return ds.get(dm.urlKey());
	}
	
	public static ModuleMetadata dm(){
		return new ModuleMetadata();
	}

	@Override
	public boolean isPresent() throws IOException {
		return base.domainsStore(dm).exists(id);
	}
}
