package com.securities.impl;

import java.io.IOException;

import com.infrastructure.core.GuidKeyEntityNone;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Module;
import com.securities.api.ModuleType;

public final class ModuleNone extends GuidKeyEntityNone<Module> implements Module {

	@Override
	public int order() throws IOException {
		return 0;
	}

	@Override
	public String name() throws IOException {
		return "Non identifié";
	}

	@Override
	public String shortName() throws IOException {
		return null;
	}

	@Override
	public String description() throws IOException {
		return null;
	}

	@Override
	public Company company() throws IOException {
		return new CompanyNone();
	}

	@Override
	public boolean isSubscribed() {
		return false;
	}

	@Override
	public boolean isInstalled() {
		return false;
	}

	@Override
	public boolean isActive() {
		return false;
	}

	@Override
	public Module install() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Module uninstall() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public void activate(boolean active) throws IOException {
		
	}

	@Override
	public ModuleType type() throws IOException {
		return ModuleType.NONE;
	}

	@Override
	public Module subscribe() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Module unsubscribe() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Indicators indicators() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Features featuresAvailable() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public FeatureSubscribed subscribeTo(Feature feature) throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		
	}

	@Override
	public Features featuresProposed() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Log log() throws IOException {
		return null;
	}
}
