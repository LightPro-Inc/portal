package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import com.infrastructure.core.EntityNone;
import com.securities.api.Feature;
import com.securities.api.ModuleType;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;

public final class ProfileFeatureNone extends EntityNone<Feature, String> implements ProfileFeature {

	@Override
	public int order() throws IOException {
		return 0;
	}

	@Override
	public String name() throws IOException {
		return "Aucune fonctionnalité";
	}

	@Override
	public Feature category() throws IOException {
		return new FeatureNone();
	}

	@Override
	public String description() throws IOException {
		return null;
	}

	@Override
	public ModuleType moduleType() throws IOException {
		return ModuleType.NONE;
	}

	@Override
	public List<Feature> children() throws IOException {
		return Arrays.asList();
	}

	@Override
	public Profile profile() throws IOException {
		return new ProfileNone();
	}
}
