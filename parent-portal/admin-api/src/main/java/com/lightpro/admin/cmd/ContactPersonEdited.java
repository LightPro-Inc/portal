package com.lightpro.admin.cmd;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import com.common.utilities.convert.TimeConvert;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.securities.api.PersonNaming;
import com.securities.api.Sex;

public class ContactPersonEdited {
	
	private final UUID id;
	private final String firstName;
	private final String lastName;
	private final Sex sex;
	private final PersonNaming naming;
	private final Date birthDate;
	private final String birthPlace;
	private final String posteOccupe;
	private final UUID societyId;
	private final String locationAddress;
	private final String phone;
	private final String mobile;
	private final String fax;
	private final String mail;
	private final String poBox;
	private final String webSite;
	private final String photo;
	
	public ContactPersonEdited(){
		throw new UnsupportedOperationException("#ContactPersonEdited()");
	}
	
	@JsonCreator
	public ContactPersonEdited(@JsonProperty("id") final UUID id,
						  @JsonProperty("firstName") final String firstName,
						  @JsonProperty("lastName") final String lastName, 
				    	  @JsonProperty("sexId") final int sexId,
				    	  @JsonProperty("namingId") final int namingId,
						  @JsonProperty("birthDate") final Date birthDate,
						  @JsonProperty("birthPlace") final String birthPlace,
						  @JsonProperty("posteOccupe") final String posteOccupe,
				    	  @JsonProperty("societyId") final UUID societyId,
				    	  @JsonProperty("locationAddress") final String locationAddress,
						  @JsonProperty("phone") final String phone, 
				    	  @JsonProperty("mobile") final String mobile,
				    	  @JsonProperty("fax") final String fax,
				    	  @JsonProperty("mail") final String mail,
				    	  @JsonProperty("poBox") final String poBox,
				    	  @JsonProperty("webSite") final String webSite,
				    	  @JsonProperty("photo") final String photo){
		
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.sex = Sex.get(sexId);
		this.naming = PersonNaming.get(namingId);
		this.birthDate = birthDate;
		this.birthPlace = birthPlace;
		this.posteOccupe = posteOccupe;
		this.societyId = societyId;
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
	
	public String firstName(){
		return firstName;
	}
	
	public String lastName(){
		return lastName;
	}
	
	public Sex sex(){
		return sex;
	}	
	
	public PersonNaming naming(){
		return naming;
	}
	
	public LocalDate birthDate(){		
		return TimeConvert.toLocalDate(birthDate, ZoneId.systemDefault());
	}
	
	public String birthPlace(){
		return birthPlace;
	}
	
	public String posteOccupe(){
		return posteOccupe;
	}
	
	public UUID societyId(){
		return societyId;
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
