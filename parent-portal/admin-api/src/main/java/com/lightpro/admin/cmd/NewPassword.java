package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NewPassword {
	
	private final String oldPassword;
	private final String newPassword;
	
	public NewPassword(){
		throw new UnsupportedOperationException("#NewPassword()");
	}
	
	public NewPassword(@JsonProperty("oldPassword") final String oldPassword,
					   @JsonProperty("newPassword") final String newPassword){
		
		this.oldPassword = oldPassword;
		this.newPassword = newPassword;
	}
	
	public String oldPassword(){
		return oldPassword;
	}
	
	public String newPassword(){
		return newPassword;
	}
}
