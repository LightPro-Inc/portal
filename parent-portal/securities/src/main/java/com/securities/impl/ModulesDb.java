package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Module;
import com.securities.api.ModuleInstalledMetadata;
import com.securities.api.ModuleType;
import com.securities.api.ModuleProposedMetadata;
import com.securities.api.ModuleState;
import com.securities.api.ModuleStatus;
import com.securities.api.ModuleSubscribedMetadata;
import com.securities.api.Modules;

public final class ModulesDb extends AdvancedQueryableDb<Module, Integer, ModuleProposedMetadata> implements Modules {

	private transient final Company company;
	private transient final ModuleType type;
	private transient final ModuleState state;
	private transient final ModuleStatus status;
	private final String remoteAddress;
	private final String remoteUsername;
	
	public ModulesDb(Base base, Company company, final ModuleType type, final ModuleState state, final ModuleStatus status, String remoteAddress, String remoteUsername) {
		super(base, "Module introuvable !");
		this.company = company;
		this.type = type;
		this.state = state;
		this.status = status;
		this.remoteAddress = remoteAddress;
		this.remoteUsername = remoteUsername;
	}
	
	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s mod "
				+ "{statement-sub} "
				+ "{statement-inst} "
				+ "WHERE mod.%s ILIKE ?",
				dm.domainName(), 
				dm.nameKey());
		
		params.add("%" + filter + "%");
		
		if(type != ModuleType.NONE){
			statement = String.format("%s AND mod.%s=?", statement, dm.keyName());
			params.add(type.id());
		}
		
		if(company.isNone()){
			statement = statement.replace("{statement-sub}", "");
			statement = statement.replace("{statement-inst}", "");
		}else {
						
			ModuleSubscribedMetadata subDm = ModuleSubscribedMetadata.create();
			ModuleInstalledMetadata instDm = ModuleInstalledMetadata.create();
			
			if(state == ModuleState.PROPOSED)
			{
				statement = statement.replace("{statement-sub}", "");
				statement = statement.replace("{statement-inst}", "");
				
				statement = String.format("%s AND mod.%s NOT IN (SELECT %s FROM %s WHERE %s=?)", statement, dm.keyName(), subDm.typeIdKey(), subDm.domainName(), subDm.companyIdKey());
				params.add(company.id());
			}else {
				statement = statement.replace("{statement-sub}", String.format("LEFT JOIN %s sub ON sub.%s=mod.%s", subDm.domainName(), subDm.typeIdKey(), dm.keyName()));
				statement = String.format("%s AND sub.%s=?", statement, subDm.companyIdKey());
				params.add(company.id());
				
				String joinInst = String.format("JOIN %s inst ON inst.%s=sub.%s", instDm.domainName(), instDm.keyName(), subDm.keyName());
				
				switch (state) {
					case SUBSCRIBED:
					case SUBSCRIBED_NOT_INSTALLED:
						statement = statement.replace("{statement-inst}", "");														
						
						if(state == ModuleState.SUBSCRIBED_NOT_INSTALLED)
							statement = String.format("%s AND sub.%s NOT IN (SELECT %s FROM %s)", statement, subDm.keyName(), instDm.keyName(), instDm.domainName());
						
						switch (status) {
							case ACTIVATED:
								statement = String.format("%s AND sub.%s IS TRUE", statement, subDm.activatedKey());
								break;
							case UNACTIVATED:
								statement = String.format("%s AND sub.%s IS FALSE", statement, subDm.activatedKey());
								break;
							default:
								break;
						}
						
						break;
					case INSTALLED:
						statement = statement.replace("{statement-inst}", joinInst);	
						
						switch (status) {
							case ACTIVATED:
								statement = String.format("%s AND inst.%s IS TRUE", statement, instDm.activatedKey());
								break;
							case UNACTIVATED:
								statement = String.format("%s AND inst.%s IS FALSE", statement, instDm.activatedKey());
								break;
							default:
								break;
						}
						
						break;
					default:
						statement = statement.replace("{statement-inst}", "");					
						break;
				}
			}			
		}
		
		String orderClause = String.format("ORDER BY mod.%s ASC", dm.orderKey());
				
		String keyResult = String.format("mod.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected Module newOne(Integer id) {
		Module module;
		
		ModuleType type = ModuleType.get(id);
		
		try {
			switch (state) {
				case SUBSCRIBED:
				case SUBSCRIBED_NOT_INSTALLED:
					module = ModuleSubscribedDb.create(base, type, company, remoteAddress, remoteUsername);
					break;
				case INSTALLED:
					module = ModuleInstalledDb.create(base, type, company, remoteAddress, remoteUsername);
					break;
				default: // PROPOSED
					module = new ModuleProposedDb(base, type, company, remoteAddress, remoteUsername);
					break;
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
				
		return module;
	}

	@Override
	public Module none() {
		return new ModuleNone();
	}

	@Override
	public Modules of(Company company) throws IOException {
		return new ModulesDb(base, company, type, state, status, remoteAddress, remoteUsername);
	}

	@Override
	public Modules of(ModuleType type) throws IOException {
		return new ModulesDb(base, company, type, state, status, remoteAddress, remoteUsername);
	}

	@Override
	public Modules of(ModuleState state) throws IOException {
		return new ModulesDb(base, company, type, state, status, remoteAddress, remoteUsername);
	}

	@Override
	public Modules of(ModuleStatus status) throws IOException {
		return new ModulesDb(base, company, type, state, status, remoteAddress, remoteUsername);
	}

	@Override
	protected Integer convertKey(Object id) {
		return Integer.parseInt(id == null ? "0" : id.toString());
	}
	
	@Override
	public boolean contains(Module item) {
		try {
			return buildQuery(StringUtils.EMPTY).exists(dm.keyName(), item.type().id());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	public Module get(ModuleType type) throws IOException {
		return get(type.id());
	}

	@Override
	public boolean contains(ModuleType type) throws IOException {
		return !of(type).isEmpty();
	}

	@Override
	public Module get(UUID id) throws IOException {
		
		ModuleSubscribedMetadata subDm = ModuleSubscribedMetadata.create();
		List<Object> results = base.executeQuery(String.format("SELECT %s FROM %s WHERE %s=?", subDm.typeIdKey(), subDm.domainName(), subDm.keyName()), Arrays.asList(id));
		if(results.isEmpty())
			throw new IllegalArgumentException(msgNotFound);
		
		ModuleType type = ModuleType.get(Integer.parseInt(results.get(0).toString()));
		return get(type);
	}
}
