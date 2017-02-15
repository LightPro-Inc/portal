package com.securities.api;

import java.io.IOException;

public interface User extends Person {
	String username() throws IOException;
	String fullUsername() throws IOException;
	String hashedPassword() throws IOException;
	boolean isLocked() throws IOException;	
	String salt() throws IOException;
	Profile profile() throws IOException;
	
	void changeProfile(Profile profile) throws IOException;
}
