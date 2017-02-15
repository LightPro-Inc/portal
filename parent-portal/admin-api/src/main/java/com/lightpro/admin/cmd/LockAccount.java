package com.lightpro.admin.cmd;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LockAccount {
	
	private final boolean isLocked;
	
	public LockAccount(){
		throw new UnsupportedOperationException("#LockAccount()");
	}
	
	public LockAccount(@JsonProperty("isLocked") final boolean isLocked){	
		this.isLocked = isLocked;
	}
	
	public boolean isLocked(){
		return isLocked;
	}
}
