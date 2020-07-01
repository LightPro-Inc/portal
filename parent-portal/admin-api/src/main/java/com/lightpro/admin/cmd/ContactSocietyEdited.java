package com.lightpro.admin.cmd;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ContactSocietyEdited {
	
	private final UUID id;
	private final String name;
	private final String locationAddress;
	private final String phone;
	private final String mobile;
	private final String fax;
	private final String mail;
	private final String poBox;
	private final String webSite;
	private final String photo;
	
	public ContactSocietyEdited(){
		throw new UnsupportedOperationException("#ContactSocietyEdited()");
	}
	
	@JsonCreator
	public ContactSocietyEdited(@JsonProperty("id") final UUID id,
						  @JsonProperty("name") final String name,
				    	  @JsonProperty("locationAddress") final String locationAddress,
						  @JsonProperty("phone") final String phone, 
				    	  @JsonProperty("mobile") final String mobile,
				    	  @JsonProperty("fax") final String fax,
				    	  @JsonProperty("mail") final String mail,
				    	  @JsonProperty("poBox") final String poBox,
				    	  @JsonProperty("webSite") final String webSite,
				    	  @JsonProperty("photo") final String photo){
		
		this.id = id;
		this.name = name;
		this.locationAddress = locationAddress;
		this.phone = phone;
		this.mobile = mobile;
		this.fax = fax;
		this.mail = mail;
		this.poBox = poBox;
		this.webSite = webSite;
		this.photo = photo;
	}
	
	public UUID id(){
		return id;
	}
	
	public String name(){
		return name;
	}
	
	public String locationAddress(){
		return locationAddress;
	}
	
	public String phone(){
		return phone;
	}
	
	public String mobile(){
		return mobile;
	}
	
	public String fax(){
		return fax;
	}
	
	public String mail(){
		return mail;
	}
	
	public String poBox(){
		return poBox;
	}
	
	public String webSite(){
		return webSite;
	}
	
	public String photo(){
		return photo;
	}
}
