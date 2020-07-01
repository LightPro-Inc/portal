package com.lightpro.admin.rs;

import java.io.IOException;

import com.securities.api.Admin;
import com.securities.api.BaseRs;
import com.securities.api.Companies;
import com.securities.api.Company;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.User;
import com.securities.impl.AdminDb;
import com.securities.impl.CompaniesDb;
import com.securities.impl.CompanyNone;

public abstract class AdminBaseRs extends BaseRs {

	public AdminBaseRs() {
		super(ModuleType.ADMIN);		
	}

	protected boolean hasValidCompany(String fullUsername) throws IOException {
		String companyShortName = User.companyShortName(fullUsername);
		Companies companies = new CompaniesDb(base, new CompanyNone());
		return companies.isPresent(companyShortName);
	}
	
	protected Company company(String fullUsername) throws IOException {
		String companyShortName = User.companyShortName(fullUsername);
		Companies companies = new CompaniesDb(base, new CompanyNone());
		return companies.get(companyShortName);
	}
	
	protected Admin admin() throws IOException {
		return admin(currentModule);
	}
	
	protected Admin admin(Module module) throws IOException {
		return new AdminDb(base, module);
	}
}
