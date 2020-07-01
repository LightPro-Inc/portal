package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureProposed;

public final class FeatureProposedDb extends FeatureBaseDb implements FeatureProposed {

	private transient final Company company;
	
	public FeatureProposedDb(final Base base, final String id, final Company company){
		super(base, id, "Fonctionnalité introuvable !");
		this.company = company;
	}

	@Override
	public Feature category() throws IOException {
		String featureId = ds.get(dm.categoryIdKey());
		
		if(featureId == null)
			return new FeatureNone();
		else
			return new FeatureProposedDb(base, featureId, company);
	}

	@Override
	public List<Feature> children() throws IOException {
		
		if(!category().isNone())
			return Arrays.asList();		
		else
			return company.features().of(this).all();
	}
}
