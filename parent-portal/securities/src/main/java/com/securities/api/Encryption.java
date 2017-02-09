package com.securities.api;

import java.io.IOException;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;

public interface Encryption {
	String createSalt() throws IOException;
	SecretKey saltToSecretKey(String salt) throws IOException;
	SecretKey stringToSecretKey(String keyWord) throws IOException;
	Claims claims(String token) throws IOException;
	String generateToken(User user) throws IOException;
	String encryptPassword(String password, String salt)  throws IOException;
}
