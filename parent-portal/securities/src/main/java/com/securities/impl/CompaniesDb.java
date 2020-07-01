package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Companies;
import com.securities.api.Company;
import com.securities.api.CompanyMetadata;
import com.securities.api.Currency;
import com.securities.impl.CompanyDb;

public final class CompaniesDb extends AdvancedQueryableDb<Company, UUID, CompanyMetadata> implements Companies {

	private final transient Company company;
	
	public CompaniesDb(final Base base, final Company company){
		super(base, "Entreprise introuvable !");
		this.company = company;
	}

	@Override
	public Company add(String denomination, 
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
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	public Company get(String shortName) throws IOException {
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.shortName());
		Optional<Object> idOpt = ds.getFirst(statement, Arrays.asList(shortName));
		
		if(!idOpt.isPresent())
			throw new IllegalArgumentException("L'entreprise n'a pas été trouvée !");
		
		return build(UUIDConvert.fromObject(idOpt.get()));
	}

	@Override
	public boolean isPresent(String shortName) {
		
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), dm.shortName());
		Optional<Object> idOpt;
		
		try {
			idOpt = ds.getFirst(statement, Arrays.asList(shortName));
			return idOpt.isPresent();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String statement = String.format("%s comp "
				+ "WHERE (comp.%s ILIKE ? OR comp.%s ILIKE ? OR comp.%s ILIKE ? OR comp.%s ILIKE ?)",
				dm.domainName(), 
				dm.denominationKey(), dm.shortName(), dm.rccmKey(), dm.nccKey());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		
		if(!company.isNone()){
			statement = String.format("%s AND (%s=? OR %s=?)", statement, horodateDm.ownerCompanyIdKey(), dm.keyName());
			params.add(company.id());
			params.add(company.id());
		}		
		
		String orderClause = String.format("ORDER BY comp.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("comp.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected Company newOne(UUID id) {
		return new CompanyDb(base, id);
	}

	@Override
	public Company none() {
		return new CompanyNone();
	}
	
	@Override
	public void delete(Company company) throws IOException {
		
		if(company.modulesInstalled().count() > 0)
			throw new IllegalArgumentException("Vous devez premièrement désinstaller les modules installés avant de continuer !");
		
		if(company.modulesSubscribed().count() > 0)
			throw new IllegalArgumentException("Vous devez premièrement désouscrire aux modules souscrits avant de continuer !");
		
		ds.delete(company.id());
	}
}
