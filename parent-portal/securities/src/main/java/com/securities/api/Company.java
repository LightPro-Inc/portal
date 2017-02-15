package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Recordable;

public interface Company extends Recordable<UUID, Company> {
	
	String denomination() throws IOException;
	String shortName() throws IOException;
	String rccm() throws IOException;
	String ncc() throws IOException;
	String siegeSocial() throws IOException;
	String bp() throws IOException;
	String tel() throws IOException;
	String fax() throws IOException;
	String email() throws IOException;
	String webSite() throws IOException;
	String logo() throws IOException;
	String currencyName() throws IOException;
	String currencyShortName() throws IOException;
	
	Company update( String denomination,
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
		            String currencyShortName) throws IOException;
	
	void changeLogo(String logo) throws IOException;	
	Modules modules();	
	Persons persons();
	Persons personNotUsers();
	Persons personUsers();
	Sequences sequences();
	MesureUnits mesureUnits();
	MesureUnitTypes mesureUnitTypes();
	Taxes taxes();
	Profiles profiles();
	Membership membership();
}
