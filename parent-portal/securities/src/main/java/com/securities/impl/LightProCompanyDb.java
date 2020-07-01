package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.datasource.Base;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.Currencies;
import com.securities.api.Currency;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Modules;

public final class LightProCompanyDb implements Company {

	private final Company origin;
	
	public LightProCompanyDb(Base base) {
		this.origin = new CompanyDb(base, UUID.fromString("c155b7df-f18b-47bd-ba49-cb525f7efaa2"));
	}

	@Override
	public String denomination() throws IOException {
		return origin.denomination();
	}

	@Override
	public String shortName() throws IOException {
		return origin.shortName();
	}

	@Override
	public String rccm() throws IOException {
		return origin.rccm();
	}

	@Override
	public String ncc() throws IOException {
		return origin.ncc();
	}

	@Override
	public String siegeSocial() throws IOException {
		return origin.siegeSocial();
	}

	@Override
	public String bp() throws IOException {
		return origin.bp();
	}

	@Override
	public String tel() throws IOException {
		return origin.tel();
	}

	@Override
	public String fax() throws IOException {
		return origin.fax();
	}

	@Override
	public String email() throws IOException {
		return origin.email();
	}

	@Override
	public String webSite() throws IOException {
		return origin.webSite();
	}

	@Override
	public String logo() throws IOException {
		return origin.logo();
	}

	@Override
	public void update(String denomination, String shortName, String rccm, String ncc, String siegeSocial, String bp,
			String tel, String fax, String email, String webSite, String logo, Currency currency) throws IOException {
		
		update(denomination, shortName, rccm, ncc, siegeSocial, bp, tel, fax, email, webSite, logo, currency);
	}

	@Override
	public void changeLogo(String logo) throws IOException {
		origin.changeLogo(logo);
	}

	@Override
	public Admin moduleAdmin() throws IOException {
		return origin.moduleAdmin();
	}

	@Override
	public Features features() throws IOException {
		return origin.features();
	}

	@Override
	public Modules modulesProposed() throws IOException {
		return origin.modulesProposed();
	}

	@Override
	public Modules modulesSubscribed() throws IOException {
		return origin.modulesSubscribed();
	}

	@Override
	public Modules modulesInstalled() throws IOException {
		return origin.modulesInstalled();
	}

	@Override
	public Modules modulesSubscribedNotInstalled() throws IOException {
		return origin.modulesSubscribedNotInstalled();
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}

	@Override
	public boolean isNone() {
		return origin.isNone();
	}

	@Override
	public UUID id() {
		return origin.id();
	}

	@Override
	public boolean equals(Object company){
		return origin.equals(company);
	}

	@Override
	public Log log() throws IOException {
		return origin.log();
	}

	@Override
	public Currency currency() throws IOException {
		return origin.currency();
	}
	
	@Override
	public Currencies currencies() throws IOException {
		return origin.currencies();
	}
}
