package com.securities.api;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.datasource.Base;

public interface App {
	
	Base base();
	Company company() throws IOException;
	Encryption passwordEncryption() throws IOException;
	User currentUser() throws IOException;
	void validateAuthentication() throws IOException;
	
	public static String getToken(String authorizationHeader){
		if (StringUtils.isEmpty(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
            return StringUtils.EMPTY;
        }
		
		return authorizationHeader.substring("Bearer".length()).trim();
	}
}
