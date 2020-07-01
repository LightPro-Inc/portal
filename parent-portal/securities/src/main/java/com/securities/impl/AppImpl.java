package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.datasource.Base;
import com.infrastructure.pgsql.PgBase;
import com.securities.api.App;
import com.securities.api.Company;
import com.securities.api.Encryption;
import com.securities.api.User;

import io.jsonwebtoken.Claims;

public final class AppImpl implements App {

	private final transient Base base;
	private final transient String token;
	private final transient Encryption encryption;

	public AppImpl(){
		this(null);	
	}
	public AppImpl(String token){
		this.token = token;
		this.encryption = new EncryptionImpl();
		this.base = buildBase();		
	}
	
	private Base buildBase() {
		
		if(!tokenIsPresent())
			return PgBase.getInstance();
		
		Claims claims;
		
		try {
			claims = encryption.claims(token);
			UUID userId = UUID.fromString(claims.get("userId", String.class));
			UUID companyId = UUID.fromString(claims.get("companyId", String.class));
			return PgBase.getInstance(userId, companyId);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}		
	}
	
	private boolean tokenIsPresent(){
		return !StringUtils.isBlank(token);
	}
	
	private void validateToken() throws IOException {
		if(!tokenIsPresent())
			throw new IllegalArgumentException("Authentification requise !");
	}
	
	@Override
	public Company company() throws IOException {
		
		if(tokenIsPresent()){
			Claims claims = encryption.claims(token);
			UUID companyId = UUID.fromString(claims.get("companyId", String.class));
			return new CompanyDb(base, companyId);
		}else
			return new LightProCompanyDb(base);
		
	}

	@Override
	public Encryption passwordEncryption() throws IOException {
		return encryption;
	}

	@Override
	public User currentUser() throws IOException {
		
		validateToken();
		
		Claims claims = encryption.claims(token);
		String username = claims.get("username", String.class);
		return company().moduleAdmin().membership().user(username);
	}

	@Override
	public void validateAuthentication() throws IOException {
		
		validateToken();
		
		User user = currentUser();
		Claims claims = encryption.claims(token);
		String hashedPassword = claims.get("password", String.class);
		
		if(!user.matchToHashedPassword(hashedPassword) || user.isLocked())
			throw new IllegalArgumentException("Authentification requise !");		
	}

	@Override
	public Base base() {
		return base;
	}
}
