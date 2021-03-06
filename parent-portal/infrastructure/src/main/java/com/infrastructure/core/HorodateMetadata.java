package com.infrastructure.core;

public class HorodateMetadata {
	
	public HorodateMetadata(){
	}

	public String ownerIdKey(){
		return "ownerid";
	}
	
	public String lastModifierIdKey(){
		return "lastmodifierid";
	}
	
	public String dateCreatedKey(){
		return "datecreated";
	}
	
	public String lastModifiedDateKey(){
		return "lastmodifieddate";
	}
	
	public String ownerCompanyIdKey(){
		return "owner_companyid";
	}
	
	public static HorodateMetadata create(){
		return new HorodateMetadata();
	}
}
