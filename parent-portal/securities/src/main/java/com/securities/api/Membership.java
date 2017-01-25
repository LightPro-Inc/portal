package com.securities.api;

import java.io.IOException;

public interface Membership {
	User get(Object id) throws IOException;
	User register(String firstName, String lastName, String username, String password) throws IOException;
	MembershipContext validateUser(String username, String password) throws IOException;
}
