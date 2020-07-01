package com.securities.api;

import java.io.IOException;
import java.util.List;

public interface User extends ContactPerson {
	
	String username() throws IOException;
	String fullUsername() throws IOException;
	String hashedPassword() throws IOException;
	boolean isLocked() throws IOException;	
	String salt() throws IOException;
	Profile profile() throws IOException;	
	void changeProfile(Profile profile) throws IOException;
	void changePassword(String newPassword, String oldPassword) throws IOException;
	void initPassword() throws IOException;	
	void lock(boolean isLock) throws IOException;
	boolean matchToPassword(String password) throws IOException;
	boolean matchToHashedPassword(String password) throws IOException;
	
	String generateToken() throws IOException;
	List<Module> modules() throws IOException;
	Indicators indicators() throws IOException;
	
	public static String username(String fullUsername) throws IOException {
		String username = fullUsername;
		String[] usernameParts = username.split("@");
		return usernameParts[0];
	}
	
	public static String companyShortName(String fullUsername) throws IOException {
		String username = fullUsername;
		String[] usernameParts = username.split("@");
		return usernameParts[usernameParts.length - 1];
	}
}
