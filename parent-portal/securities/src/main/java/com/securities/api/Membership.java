package com.securities.api;

import java.io.IOException;
import java.util.UUID;

public interface Membership {
	User get(UUID id) throws IOException;
	User get(String username) throws IOException;
	User register(String firstName, String lastName, String username, String password) throws IOException;
	MembershipContext validateUser(String username, String password) throws IOException;
}
