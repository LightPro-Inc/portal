package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Admin;
import com.securities.api.PaymentMode;
import com.securities.api.PaymentModeType;

public final class PaymentModeNone extends EntityNone<PaymentMode, UUID> implements PaymentMode {

	@Override
	public String name() throws IOException {
		return "Aucun mode";
	}

	@Override
	public PaymentModeType type() throws IOException {
		return PaymentModeType.NONE;
	}

	@Override
	public Admin module() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !"); 
	}

	@Override
	public void update(String name) throws IOException {
		
	}

	@Override
	public boolean active() throws IOException {
		return false;
	}

	@Override
	public void enable(boolean active) throws IOException {
		
	}
}
