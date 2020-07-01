package com.securities.api;

import java.io.IOException;

public interface Admin extends Module {
	
	Contacts contacts() throws IOException;
	Sequences sequences() throws IOException;
	MesureUnits mesureUnits() throws IOException;	
	Taxes taxes() throws IOException;
	PaymentModes paymentModes() throws IOException;
	Profiles profiles() throws IOException;
	Membership membership() throws IOException;
	Indicators indicators() throws IOException;	
}
