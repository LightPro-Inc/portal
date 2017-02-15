package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;

public interface Companies extends AdvancedQueryable<Company, UUID> {
	
	Company add(String denomination,
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
	
	Company get(String shortName) throws IOException;
	boolean isPresent(String shortName);
	
}
