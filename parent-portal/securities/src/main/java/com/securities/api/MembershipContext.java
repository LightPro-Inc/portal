package com.securities.api;

import java.util.UUID;

public class MembershipContext {
	private transient final User user;	
	
	public MembershipContext(User user){
		this.user = user;
	}
	
	public boolean isValid(){
		return this.user != null;
	}
	
	public UUID idUser(){
		return isValid() ? this.user.id() : null;
	}
	
	public String tokens(){
		if(isValid())
			return generateTokens();
		else
			return "";
	}
	
	private String generateTokens(){
		return "";
	}
		
}
