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
	public boolean getIsValid(){
		return membershipContext.isValid();
	}
	
	@JsonGetter
	public String getToken() throws IOException {
		return membershipContext.token();
	}
	
	@JsonGetter
	public UUID getIdUser(){
		return membershipContext.userId();
	}
}
