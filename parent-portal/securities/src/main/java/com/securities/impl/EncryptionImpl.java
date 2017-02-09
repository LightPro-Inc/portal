package com.securities.impl;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.securities.api.Encryption;
import com.securities.api.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class EncryptionImpl implements Encryption {

	private final String keyStr = "AigleRoyal7";
	
	@Override
	public String createSalt() throws IOException {
		
		// create new key
		SecretKey secretKey;
		try {
			secretKey = KeyGenerator.getInstance("AES").generateKey();
		} catch (NoSuchAlgorithmException e) {			// 
			e.printStackTrace();
			throw new IOException(e);
		}
		// get base64 encoded version of the key
		return Base64.getEncoder().encodeToString(secretKey.getEncoded());
	}
	
	@Override
	public SecretKey saltToSecretKey(String salt) throws IOException {		
		// decode the base64 encoded string
		byte[] decodedKey = Base64.getDecoder().decode(salt);
		// rebuild key using SecretKeySpec
		return new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES"); 
	}
	
	@Override
	public SecretKey stringToSecretKey(String keyWord) throws IOException {				
		byte[] bytes = keyWord.getBytes("UTF-8");
		return new SecretKeySpec(bytes, 0, bytes.length, "AES"); 
	}

	@Override
	public String encryptPassword(String password, String salt) throws IOException {

		String generatedPassword = null;
		
	    try {
	         MessageDigest md = MessageDigest.getInstance("SHA-512");
	         md.update(salt.getBytes("UTF-8"));
	         byte[] bytes = md.digest(password.getBytes("UTF-8"));
	         generatedPassword = Base64.getEncoder().encodeToString(bytes);
	        } 
	       catch (NoSuchAlgorithmException e){
	    	   e.printStackTrace();
	       }
	    
	    return generatedPassword;
	}

	@Override
	public Claims claims(String token) throws IOException {
		return Jwts.parser()
				   .setSigningKey(stringToSecretKey(keyStr))
				   .parseClaimsJws(token)
				   .getBody();
	}

	@Override
	public String generateToken(User user) throws IOException {
		
		Map<String, Object> claims = new HashMap<String, Object>();
		claims.put("username", user.username());
		claims.put("password", user.hashedPassword());
		claims.put("companyId", user.company().id());
		
		return Jwts.builder()
				  .setSubject(user.username())
				  .setId(user.id().toString())
				  .setClaims(claims)
				  .signWith(SignatureAlgorithm.HS512, stringToSecretKey(keyStr))
				  .compact();
	}

}
