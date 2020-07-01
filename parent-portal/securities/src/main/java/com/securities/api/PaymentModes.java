package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;

public interface PaymentModes extends AdvancedQueryable<PaymentMode, UUID> {

	PaymentMode add(String name, PaymentModeType type) throws IOException;
	PaymentModes of(PaymentModeType type) throws IOException;
	PaymentModes of(PaymentModeStatus status) throws IOException;
}
