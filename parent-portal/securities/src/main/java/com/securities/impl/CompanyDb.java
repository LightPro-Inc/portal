package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.CompanyMetadata;
import com.securities.api.Currencies;
import com.securities.api.Currency;
import com.securities.api.FeatureState;
import com.securities.api.FeatureType;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Module;
import com.securities.api.ModuleState;
import com.securities.api.ModuleStatus;
import com.securities.api.ModuleType;
import com.securities.api.Modules;

public final class CompanyDb extends GuidKeyEntityDb<CompanyDb, CompanyMetadata> implements Company {
	
	private final String remoteAddress;
	private final String remoteUsername;
	
	public CompanyDb(final Base base, final UUID id, String remoteAddress, String remoteUsername) {
		super(base, id, "Entreprise non retrouvée !");
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
	}
	
	public CompanyDb(final Base base, final UUID id) {
		this(base, id, "127.0.0.1", "admin");
	}

	@Override
	public String denomination() throws IOException {
		return ds.get(dm.denominationKey());
	}

	@Override
	public String rccm() throws IOException {
		return ds.get(dm.rccmKey());
	}

	@Override
	public String ncc() throws IOException {
		return ds.get(dm.nccKey());
	}

	@Override
	public String siegeSocial() throws IOException {
		return ds.get(dm.siegeSocialKey());
	}

	@Override
	public String bp() throws IOException {
		return ds.get(dm.bpKey());
	}

	@Override
	public String tel() throws IOException {
		return ds.get(dm.telKey());
	}

	@Override
	public String fax() throws IOException {
		return ds.get(dm.faxKey());
	}

	@Override
	public String email() throws IOException {
		return ds.get(dm.emailKey());
	}

	@Override
	public String webSite() throws IOException {
		return ds.get(dm.webSiteKey());
	}

	@Override
	public String logo() throws IOException {
		return ds.get(dm.logoKey());
	}

	@Override
	public UUID id() {
		return this.id;
	}

	@Override
	public void update( String denomination,
						   String shortName,
						   String rccm, 
						   String ncc,
					   	   String siegeSocial, 
					   	   String bp, 
					   	   String tel, 
					   	   String fax,
					   	   String email,
				   	   	   String webSite, 
				   	   	   String logo,
				   	   	   Currency currency) throws IOException {
		
		if(StringUtils.isBlank(denomination))
			throw new IllegalArgumentException("La dénomination ne doit pas être vide!");
		
		if(StringUtils.isBlank(shortName))
			throw new IllegalArgumentException("Le nom court ne doit être renseigné !");
		
		if(currency.isNone())
			throw new IllegalArgumentException("Vous devez spécifier la devise principale de l'entreprise !");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.denominationKey(), denomination);
		params.put(dm.shortName(), shortName);
		params.put(dm.rccmKey(), rccm);
		params.put(dm.nccKey(), ncc);
		params.put(dm.siegeSocialKey(), siegeSocial);
		params.put(dm.bpKey(), bp);
		params.put(dm.telKey(), tel);
		params.put(dm.faxKey(), fax);
		params.put(dm.emailKey(), email);
		params.put(dm.webSiteKey(), webSite);
		params.put(dm.logoKey(), logo);
		params.put(dm.currencyIdKey(), currency.id());
		
		ds.set(params);
	}

	@Override
	public void changeLogo(String logo) throws IOException {
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.logoKey(), logo);
		
		ds.set(params); 
	}		

	@Override
	public String shortName() throws IOException {
		return ds.get(dm.shortName());
	}

	@Override
	public Admin moduleAdmin() throws IOException {
		Module module = modulesInstalled().get(ModuleType.ADMIN);
		return new AdminDb(base, module);
	}

	@Override
	public Features features() throws IOException {
		return new FeaturesDb(base, this, ModuleType.NONE, new ModuleNone(), new FeatureNone(), FeatureState.PROPOSED, FeatureType.NONE, new ProfileNone());
	}

	@Override
	public Modules modulesSubscribed() throws IOException {
		return new ModulesDb(base, this, ModuleType.NONE, ModuleState.SUBSCRIBED, ModuleStatus.NONE, remoteAddress, remoteUsername);
	}
	
	@Override
	public Modules modulesProposed() throws IOException {
		return new ModulesDb(base, this, ModuleType.NONE, ModuleState.PROPOSED, ModuleStatus.NONE, remoteAddress, remoteUsername);
	}
	
	@Override
	public Modules modulesSubscribedNotInstalled() throws IOException {
		return new ModulesDb(base, this, ModuleType.NONE, ModuleState.SUBSCRIBED_NOT_INSTALLED, ModuleStatus.NONE, remoteAddress, remoteUsername);
	}

	@Override
	public Modules modulesInstalled() throws IOException {
		return new ModulesDb(base, this, ModuleType.NONE, ModuleState.INSTALLED, ModuleStatus.NONE, remoteAddress, remoteUsername);
	}

	@Override
	public Indicators indicators() throws IOException {
		return new IndicatorsDb(base, ModuleType.NONE, new UserNone());
	}
	
	@Override
	public Log log() throws IOException {
		return LogDb.getInstance(shortName(), ModuleType.NONE, StringUtils.EMPTY);
	}

	@Override
	public Currency currency() throws IOException {
		String currencyId = ds.get(dm.currencyIdKey());
		return new CurrencyDb(base, currencyId);
	}
	
	@Override
	public Currencies currencies() throws IOException {
		return new CurrenciesDb(base, this);
	}
}
