package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.securities.api.User;

public final class MembershipContextVm {
	
	public final String token;
	public final UUID idUser;
	public final String domain;
	public final String photo;
	
	public MembershipContextVm() {
        throw new UnsupportedOperationException("#MembershipContextVm()");
    }
	
	public MembershipContextVm(final User user) {
		try {
			this.token = user.generateToken();
	        this.idUser = user.id();
	        this.domain = String.format("@%s", user.company().shortName());
	        this.photo = user.photo();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
    }
}
