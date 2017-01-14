package com.lightpro.admin.rs;

import java.util.UUID;

import com.infrastructure.core.BaseRs;
import com.securities.api.Company;
import com.securities.impl.CompanyImpl;

public class AdminBaseRs extends BaseRs {
	protected Company company(){
		UUID companyOwnerId = UUID.fromString("c155b7df-f18b-47bd-ba49-cb525f7efaa2");
		return new CompanyImpl(base, companyOwnerId);
	}
}
