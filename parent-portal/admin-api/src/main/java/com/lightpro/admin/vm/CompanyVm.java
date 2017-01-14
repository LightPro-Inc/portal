package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.Company;

public class CompanyVm {
	private final transient Company company;
	
	public CompanyVm() {
        throw new UnsupportedOperationException("#CompanyVm()");
    }
	
	public CompanyVm(final Company company) {
        this.company = company;
    }
	
	@JsonGetter
	public UUID getId(){
		return company.id();
	}
	
	@JsonGetter
	public String getDenomination() throws IOException {
		return company.denomination();
	}
	
	@JsonGetter
	public String getRccm() throws IOException {
		return company.rccm();
	}
	
	@JsonGetter
	public String getNcc() throws IOException {
		return company.ncc();
	}
	
	@JsonGetter
	public String getSiegeSocial() throws IOException {
		return company.siegeSocial();
	}
	
	@JsonGetter
	public String getBp() throws IOException {
		return company.bp();
	}
	
	@JsonGetter
	public String getTel() throws IOException {
		return company.tel();
	}
	
	@JsonGetter
	public String getFax() throws IOException {
		return company.fax();
	}
	
	@JsonGetter
	public String getEmail() throws IOException {
		return company.email();
	}
	
	@JsonGetter
	public String getWebSite() throws IOException {
		return company.webSite();
	}
	
	@JsonGetter
	public String getLogo() throws IOException {
		return company.logo();
	}
}
