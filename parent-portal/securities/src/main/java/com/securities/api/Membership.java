package com.securities.api;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;
import com.infrastructure.core.Updatable;

public interface Membership extends AdvancedQueryable<User, UUID>, Updatable<User> {
	
	User get(String username) throws IOException;
	User getByFullUsername(String fullUsername) throws IOException;
	
	User register(String firstName, String lastName, Sex sex, String address, LocalDate birthDate, String tel1, String tel2, String email, String photo, String username, Profile profile) throws IOException;
	User register(Person person, String username, Profile profile) throws IOException;
	
	MembershipContext validateUser(String username, String password) throws IOException;
	MembershipContext validateUserByFullUserName(String fullUsername, String password) throws IOException;
	
	void changePassword(String username, String newPassword, String oldPassword) throws IOException;
	void changePasswordByFullUsername(String fullUsername, String newPassword, String oldPassword) throws IOException;
	void initPassword(User user) throws IOException;
	
	void lock(User user, boolean isLock) throws IOException;
}
