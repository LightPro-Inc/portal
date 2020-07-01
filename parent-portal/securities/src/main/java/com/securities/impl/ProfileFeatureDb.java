package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.infrastructure.datasource.Base;
import com.securities.api.Feature;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;
import com.securities.api.ProfileFeatureMetadata;

public final class ProfileFeatureDb extends FeatureBaseDb implements ProfileFeature {

	private transient final Profile profile;
	private transient final Object pfId;
	
	public ProfileFeatureDb(final Base base, final String id, final Profile profile){
		super(base, id, "Fonctionnalité du profil introuvable !");
		this.profile = profile;
		
		this.pfId = pfId(this.base, this, this.profile);
		if(this.pfId == null)
			throw new IllegalArgumentException("Fonctionnalité du profil introuvable !");
	}
	
	public static Object pfId(Base base, Feature feature, Profile profile){
		
		ProfileFeatureMetadata dm = ProfileFeatureMetadata.create();
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.featureIdKey(), dm.profileIdKey());
		List<Object> params = Arrays.asList(feature.id(), profile.id());
		
		try {
			List<Object> results = base.executeQuery(statement, params);
			if(results.isEmpty())
				return null;
			else
				return results.get(0);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	@Override
	public Feature category() throws IOException {
		String categoryId = ds.get(dm.categoryIdKey());
		
		if(categoryId == null)
			return new FeatureNone();
		else
			return new ProfileFeatureDb(base, categoryId, profile);
	}

	@Override
	public List<Feature> children() throws IOException {
		List<Feature> features = new ArrayList<Feature>();
		if(category().isNone()) {
			for (Feature feature : profile.featuresSubscribed().of(this).all()) {
				features.add(new ProfileFeatureDb(base, feature.id(), profile));
			};
		}
		
		return features;
	}

	@Override
	public Profile profile() throws IOException {
		return profile;
	}
}
