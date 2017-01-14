package com.securities.api;

public class MembershipContext {
	private transient final User user;	
	
	public MembershipContext(User user){
		this.user = user;
	}
	
	public boolean isValid(){
		return this.user != null;
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
