package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.UseCode;

public interface Membership extends AdvancedQueryable<User, UUID> {
	
	User defaultUser() throws IOException;		
		
	User register(ContactPerson person, String username, Profile profile) throws IOException;
	User user(String username) throws IOException;
	boolean contains(String username) throws IOException;
	
	Membership withUseCode(UseCode useCode) throws IOException;
}