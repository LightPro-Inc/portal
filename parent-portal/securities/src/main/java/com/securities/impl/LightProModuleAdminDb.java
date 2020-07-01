package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.datasource.Base;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.Contacts;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Membership;
import com.securities.api.MesureUnits;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.PaymentModes;
import com.securities.api.Profiles;
import com.securities.api.Sequences;
import com.securities.api.Taxes;

public final class LightProModuleAdminDb implements Admin {

	private final Admin origin;
	private final String remoteAddress;
	private final String remoteUsername;
	
	public LightProModuleAdminDb(final Base base, final String remoteAddress, final String remoteUsername){
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
		this.origin = new AdminDb(base, ModuleInstalledDb.create(base, UUID.fromString("c155b7df-f18b-47bd-ba49-cb525f7efaa2"), remoteAddress, remoteUsername));
	}
	
	@Override
	public UUID id() {
		return origin.id();
	}

	@Override
	public int order() throws IOException {
		return origin.order();
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public String shortName() throws IOException {
		return origin.shortName();
	}

	@Override
	public String description() throws IOException {
		return origin.description();
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
	}

	@Override
	public boolean isSubscribed() {
		return origin.isSubscribed();
	}

	@Override
	public boolean isActive() {
		return origin.isActive();
	}

	@Override
	public boolean isInstalled() {
		return origin.isInstalled();
	}

	@Override
	public ModuleType type() throws IOException {
		return origin.type();
	}

	@Override
	public Module subscribe() throws IOException {
		return origin.subscribe();
	}

	@Override
	public Module unsubscribe() throws IOException {
		return origin.unsubscribe();
	}

	@Override
	public Module install() throws IOException {
		return origin.install();
	}

	@Override
	public Module uninstall() throws IOException {
		return origin.uninstall();
	}

	@Override
	public void activate(boolean active) throws IOException {
		origin.activate(active);
	}

	@Override
	public FeatureSubscribed subscribeTo(Feature feature) throws IOException {
		return origin.subscribeTo(feature);
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		origin.unsubscribeTo(feature);
	}

	@Override
	public Features featuresProposed() throws IOException {
		return origin.featuresProposed();
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		return origin.featuresSubscribed();
	}

	@Override
	public Features featuresAvailable() throws IOException {
		return origin.featuresAvailable();
	}

	@Override
	public boolean isNone() {
		return origin.isNone();
	}

	@Override
	public Contacts contacts() throws IOException {
		return origin.contacts();
	}

	@Override
	public Sequences sequences() throws IOException {
		return origin.sequences();
	}

	@Override
	public MesureUnits mesureUnits() throws IOException {
		return origin.mesureUnits();
	}

	@Override
	public Taxes taxes() throws IOException {
		return origin.taxes();
	}

	@Override
	public PaymentModes paymentModes() throws IOException {
		return origin.paymentModes();
	}

	@Override
	public Profiles profiles() throws IOException {
		return origin.profiles();
	}

	@Override
	public Membership membership() throws IOException {
		return origin.membership();
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}

	@Override
	public Log log() throws IOException {
		return company().log().ofModule(ModuleType.ADMIN).ofUser(remoteUsername).withIpAddress(remoteAddress);
	}
}
