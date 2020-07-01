package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.Company;

public final class CompanyVm {
	
	public final UUID id;
	public final String denomination;
	public final String rccm;
	public final String ncc;
	public final String siegeSocial;
	public final String bp;
	public final String tel;
	public final String fax;
	public final String email;
	public final String webSite;
	public final String logo;
	public final String currency;
	public final String symbolCurrency;
	public final String currencyId;
	public final String shortName;
	
	public CompanyVm() {
        throw new UnsupportedOperationException("#CompanyVm()");
    }
	
	public CompanyVm(final Company company) {
		try {
			this.id = company.id();
	        this.denomination = company.denomination();
	        this.rccm = company.rccm();
	        this.ncc = company.ncc();
	        this.siegeSocial = company.siegeSocial();
	        this.bp = company.bp();
	        this.tel = company.tel();
	        this.fax = company.fax();
	        this.email = company.email();
	        this.webSite = company.webSite();
	        this.logo = company.logo();
	        this.currencyId = company.currency().id();
	        this.currency = company.currency().name();
	        this.symbolCurrency = company.currency().symbol();
	        this.shortName = company.shortName();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}		     
    }
}
