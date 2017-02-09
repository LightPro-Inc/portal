package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.securities.impl.EncryptionImpl;

public class MembershipContext {
	private transient final User user;
	private transient final Encryption encryption;
	
	public MembershipContext(final User user){
		this.user = user;
		this.encryption = new EncryptionImpl();
	}
	
	public boolean isValid(){
		return this.user != null;
	}
	
	public UUID userId(){
		return this.isValid() ? user.id() : null;
	}
	
	public User user (){
		return user;
	}
	
	public String token() throws IOException {
		String token = "";
		
		if(isValid())
			token = encryption.generateToken(this.user);
		
		return token;
	}	
}
