package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.infrastructure.datasource.Base;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.FeatureSubscribedMetadata;
import com.securities.api.Module;

public final class FeatureSubscribedDb extends FeatureBaseDb implements FeatureSubscribed {

	private transient final Module module;
	private transient final Object fsId;
	
	public FeatureSubscribedDb(final Base base, final String id, final Module module){
		super(base, id, "Fonctionnalité introuvable !");
		this.module = module;
		this.fsId = fsId(this.base, this, this.module);
		
		if(this.fsId == null)
			throw new IllegalArgumentException("Fonctionnalité introuvable !");
	}
	
	public static Object fsId(Base base, Feature feature, Module module){
		FeatureSubscribedMetadata dm = FeatureSubscribedMetadata.create();
		String statement = String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.featureIdKey(), dm.moduleIdKey());
		List<Object> params = Arrays.asList(feature.id(), module.id());
		
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
			return new FeatureSubscribedDb(base, categoryId, module);
	}

	@Override
	public List<Feature> children() throws IOException {
		List<Feature> features = new ArrayList<Feature>();
		
		if(category().isNone()) {
			for (Feature feature : module.featuresSubscribed().of(this).all()) {
				features.add(new FeatureSubscribedDb(base, feature.id(), module));
			}
		}
		
		return features;
	}

	@Override
	public Module module() throws IOException {
		return module;
	}
}
