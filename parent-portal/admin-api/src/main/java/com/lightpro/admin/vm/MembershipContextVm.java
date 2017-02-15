package com.lightpro.admin.vm;

import java.io.IOException;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.securities.api.MembershipContext;

public class MembershipContextVm {
	
	private final transient MembershipContext membershipContext;
	
	public MembershipContextVm() {
        throw new UnsupportedOperationException("#MembershipContextVm()");
    }
	
	public MembershipContextVm(final MembershipContext membershipContext) {
        this.membershipContext = membershipContext;
    }
	
	@JsonGetter
	public String getToken() throws IOException {
		return membershipContext.token();
	}
	
	@JsonGetter
	public UUID getIdUser(){
		return membershipContext.user().id();
	}
	
	@JsonGetter
	public String getDomain() throws IOException{
		return String.format("@%s", membershipContext.user().company().shortName());
	}
}
