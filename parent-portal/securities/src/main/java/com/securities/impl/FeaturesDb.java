package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Feature;
import com.securities.api.FeatureMetadata;
import com.securities.api.FeatureState;
import com.securities.api.FeatureSubscribed;
import com.securities.api.FeatureSubscribedMetadata;
import com.securities.api.FeatureType;
import com.securities.api.Features;
import com.securities.api.Module;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.ModuleType;
import com.securities.api.Profile;
import com.securities.api.ProfileFeature;
import com.securities.api.ProfileFeatureMetadata;

public final class FeaturesDb extends AdvancedQueryableDb<Feature, String, FeatureMetadata> implements Features {

	private final transient ModuleType moduleType;
	private final transient Company company;
	private final transient Module module;
	private final transient Feature category;
	private final transient FeatureState state;
	private final transient FeatureType type;
	private final transient Profile profile;
	
	public FeaturesDb(final Base base, Company company, final ModuleType moduleType, final Module module, final Feature category, final FeatureState state, final FeatureType type, final Profile profile){
		super(base, "Fonctionnalité introuvable !");
		this.company = company;
		this.module = module;
		this.moduleType = moduleType;
		this.category = category;
		this.state = state;
		this.type = type;
		this.profile = profile;
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
				
		String statement = String.format("%s ft "
				+ "{statement-fts} "
				+ "{statement-pft} "
				+ "WHERE ft.%s ILIKE ?",
				dm.domainName(), 
				dm.nameKey());
		
		params.add("%" + filter + "%");
		
		if(type == FeatureType.FEATURE){
			statement = String.format("%s AND ft.%s IS NOT NULL", statement, dm.categoryIdKey());
		}
		
		if(type == FeatureType.FEATURE_CATEGORY){
			statement = String.format("%s AND ft.%s IS NULL", statement, dm.categoryIdKey());
		}
		
		if(!category.isNone()){
			statement = String.format("%s AND ft.%s=?", statement, dm.categoryIdKey());
			params.add(category.id());
		}
		
		switch (state) {
			case PROPOSED:
				statement = statement.replace("{statement-fts}", "");
				statement = statement.replace("{statement-pft}", "");
				
				if(moduleType != ModuleType.NONE && module.isNone()){
					statement = String.format("%s AND ft.%s=?", statement, dm.moduleTypeIdKey());
					params.add(moduleType.id());
				} else{
					if(!module.isNone()){
						statement = String.format("%s AND ft.%s=?", statement, dm.moduleTypeIdKey());
						params.add(module.type().id());
					}
				}
				
				if(!profile.isNone()){
					ProfileFeatureMetadata pftDm = ProfileFeatureMetadata.create(); 
					statement = String.format("%s AND ft.%s NOT IN (SELECT %s FROM %s WHERE %s=?)", statement, dm.keyName(), pftDm.featureIdKey(), pftDm.domainName(), pftDm.profileIdKey());
					params.add(profile.id());
				}				
				break;
			case SUBSCRIBED:
			case USER_SUBSCRIBED:
				FeatureSubscribedMetadata fsDm = FeatureSubscribedMetadata.create();
				ModuleSubscribedMetadata msDm = ModuleSubscribedMetadata.create();
				String clause = String.format("JOIN %s fts ON fts.%s=ft.%s "
						+ "LEFT JOIN %s ms ON ms.%s=fts.%s", 
						fsDm.domainName(), fsDm.featureIdKey(), dm.keyName(),
						msDm.domainName(), msDm.keyName(), fsDm.moduleIdKey());
				statement = statement.replace("{statement-fts}", clause);	
				
				if(!module.isNone()){
					statement = String.format("%s AND ms.%s=?", statement, msDm.keyName());
					params.add(module.id());
				}
				
				if(!profile.isNone())
				{
					ProfileFeatureMetadata pftDm = ProfileFeatureMetadata.create();
					clause = String.format("JOIN %s p ON p.%s=ft.%s ", pftDm.domainName(), pftDm.featureIdKey(), dm.keyName());
					statement = statement.replace("{statement-pft}", clause); 
					statement = String.format("%s AND p.%s=?", statement, pftDm.profileIdKey());
					params.add(profile.id());
				}else {
					statement = statement.replace("{statement-pft}", ""); 
				}
				
				break;				
			default:
				statement = statement.replace("{statement-fts}", "");
				statement = statement.replace("{statement-pft}", "");
				break;
		}
				
		String orderClause = String.format("ORDER BY ft.%s ASC", dm.orderKey());
		
		String keyResult = String.format("ft.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected Feature newOne(String id) {
		
		if(!profile.isNone() && state == FeatureState.SUBSCRIBED)
			return new ProfileFeatureDb(base, id, profile);
		
		if(!module.isNone() && state == FeatureState.SUBSCRIBED)
			return new FeatureSubscribedDb(base, id, module);
		
		return new FeatureProposedDb(base, id, company);
	}

	@Override
	public Feature none() {
		return new FeatureNone();
	}

	@Override
	protected String convertKey(Object id) {
		return id == null ? null : id.toString();
	}

	@Override
	public Features of(Feature category) throws IOException {
		return new FeaturesDb(base, company, moduleType, module, category, state, FeatureType.FEATURE, profile);
	}

	@Override
	public Features of(ModuleType moduleType) throws IOException {
		return new FeaturesDb(base, company, moduleType, new ModuleNone(), category, state, type, profile);
	}

	@Override
	public Features of(Module module) throws IOException {
		return new FeaturesDb(base, company, module.type(), module, category, state, type, profile);
	}

	@Override
	public Features of(FeatureType type) throws IOException {
		return new FeaturesDb(base, company, moduleType, module, category, state, type, profile);
	}

	@Override
	public Features of(Profile profile) throws IOException {
		return new FeaturesDb(base, company, moduleType, module, category, FeatureState.USER_SUBSCRIBED, type, profile);
	}

	@Override
	public FeatureSubscribed addToModule(Feature item) throws IOException {
		
		if(module.isNone())
			throw new IllegalArgumentException("Vous devez indiquer un module !");
		
		if(item.isNone())
			throw new IllegalArgumentException("Vous devez indiquer une fonctionnalité !");
		
		if(contains(item))
			return new FeatureSubscribedDb(base, item.id(), module);
		
		FeatureSubscribedMetadata dm = FeatureSubscribedMetadata.create();
		DomainsStore ds = base.domainsStore(dm);
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.featureIdKey(), item.id());
		params.put(dm.moduleIdKey(), module.id());
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return new FeatureSubscribedDb(base, item.id(), module);
	}

	@Override
	public void removeFromModule(Feature item) throws IOException {
		
		if(module.isNone())
			throw new IllegalArgumentException("Vous devez indiquer un module !");
		
		if(item.isNone())
			throw new IllegalArgumentException("Vous devez indiquer une fonctionnalité !");
		
		if(contains(item)) {
			FeatureSubscribedMetadata dm = FeatureSubscribedMetadata.create();
			String statement = String.format("DELETE FROM %s WHERE %s=? AND %s=?", dm.domainName(), dm.featureIdKey(), dm.moduleIdKey());
			base.executeUpdate(statement, Arrays.asList(item.id(), module.id()));
		}
	}

	@Override
	public ProfileFeature addToProfile(Feature item) throws IOException {
		
		if(profile.isNone())
			throw new IllegalArgumentException("Vous devez indiquer un profil !");
		
		if(item.isNone())
			throw new IllegalArgumentException("Vous devez indiquer une fonctionnalité !");
		
		if(contains(item))
			return new ProfileFeatureDb(base, item.id(), profile);
		
		ProfileFeatureMetadata dm = ProfileFeatureMetadata.create();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.featureIdKey(), item.id());
		params.put(dm.profileIdKey(), profile.id());
		
		UUID id = UUID.randomUUID();
		base.domainsStore(dm).set(id, params);
		
		return new ProfileFeatureDb(base, item.id(), profile);
	}

	@Override
	public void removeFromProfile(Feature item) throws IOException {
		
		if(profile.isNone())
			throw new IllegalArgumentException("Vous devez indiquer un profil !");
				
		if(contains(item)) {
			ProfileFeatureMetadata dm = ProfileFeatureMetadata.create();
			String statement = String.format("DELETE FROM %s WHERE %s=? AND %s=?", dm.domainName(), dm.profileIdKey(), dm.featureIdKey());
			base.executeUpdate(statement, Arrays.asList(profile.id(), item.id()));	
		}			
	}

	@Override
	public Features of(FeatureState state) throws IOException {
		return new FeaturesDb(base, company, moduleType, module, category, state, type, profile);
	}
	
	@Override
	public void delete(Feature item) throws IOException {
		throw new IllegalArgumentException("Vous ne pouvez pas supprimer de fonctionnalité !");
	}

	@Override
	public void deleteAll() throws IOException {
		for (Feature feature : all()) {
			delete(feature);
		}
	}
}
