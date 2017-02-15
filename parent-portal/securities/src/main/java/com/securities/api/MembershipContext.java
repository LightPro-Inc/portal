package com.securities.api;

import java.io.IOException;
import java.util.UUID;

public class MembershipContext {
	
	private transient final User user;	
	private transient final Encryption encryption;
	
	public MembershipContext(User user, Encryption encryption){
		this.user = user;
		this.encryption = encryption;
	}
	
	public UUID userId(){
		return user.id();
	}
	
	public User user(){
		return user;
	}
	
	public String token() throws IOException {
		return encryption.generateToken(user.fullUsername(), user.id(), user.hashedPassword(), user.company().id());
	}	
}
