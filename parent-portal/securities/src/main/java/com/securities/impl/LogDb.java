package com.securities.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyAdvancedQueryableDb;
import com.infrastructure.core.Period;
import com.infrastructure.core.impl.PeriodNone;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.QueryBuilder;
import com.infrastructure.pgsql.PgBase;
import com.securities.api.Company;
import com.securities.api.EventLog;
import com.securities.api.EventLogCategory;
import com.securities.api.EventLogMetadata;
import com.securities.api.EventLogType;
import com.securities.api.Log;
import com.securities.api.ModuleType;
import com.securities.api.User;

public final class LogDb extends GuidKeyAdvancedQueryableDb<EventLog, EventLogMetadata> implements Log {

	private final String companyDomain;
	private final ModuleType moduleType;
	private final String username;
	private final EventLogCategory eventCategory;
	private final EventLogType eventType;
	private final String ipAddress;
	private final Period period;
	
	public static Log getInstance() throws IOException {
		
		Base base = PgBase.getInstance();
		
		String companyDomain = new LightProCompanyDb(base).shortName();
		String username = "admin";
		ModuleType moduleType = ModuleType.ADMIN;
		
		return new LogDb(base, companyDomain, moduleType, username, EventLogCategory.NONE, EventLogType.NONE, StringUtils.EMPTY, new PeriodNone());
	}
	
	public static Log getInstance(final String companyDomain) throws IOException {
		
		return LogDb.getInstance(companyDomain, ModuleType.NONE, StringUtils.EMPTY); 
	}

	public static Log getInstance(final String companyDomain, final ModuleType moduleType, final String username) throws IOException {
		
		Base base = PgBase.getInstance();
		
		return new LogDb(base, companyDomain, moduleType, username, EventLogCategory.NONE, EventLogType.NONE, StringUtils.EMPTY, new PeriodNone()); 
	}
	
	private LogDb(final Base base, final String companyDomain, final ModuleType moduleType, final String username, final EventLogCategory eventCategory, final EventLogType eventType, final String ipAddress, final Period period) {
		super(base, "Evènement de log non retrouvé !");
		
		this.companyDomain = companyDomain; 
		this.moduleType = moduleType;
		this.username = username;
		this.eventCategory = eventCategory;
		this.eventType = eventType;
		this.ipAddress = ipAddress;
		this.period = period;
	}

	@Override
	public void delete(EventLog item) throws IOException {
		throw new IllegalArgumentException("Vous ne pouvez pas supprimer un évènement de log !");
	}

	private void add(LocalDateTime date, EventLogCategory category, EventLogType type, String message, String details) {

		try {
			
			if(StringUtils.isBlank(ipAddress))
				throw new IllegalArgumentException("Vous devez indiquer l'adresse IP de la machine de l'auteur de l'évènement du log !");
			
			if(date == null)
				throw new IllegalArgumentException("Vous devez indiquer la date de l'évènement");
			
			if(category == EventLogCategory.NONE)
				throw new IllegalArgumentException("Vous devez indiquer la catégorie de l'évènement !");
			
			if(type == EventLogType.NONE)
				throw new IllegalArgumentException("Vous devez indiquer le type de l'évènement !");
			
			if(StringUtils.isBlank(message))
				throw new IllegalArgumentException("Vous devez indiquer le message de l'évènement !");		
			
			Map<String, Object> params = new HashMap<String, Object>();
			
			params.put(dm.dateCreatedKey(), java.sql.Timestamp.valueOf(date));
			params.put(dm.categoryIdKey(), category.id());
			params.put(dm.typeIdKey(), type.id());
			params.put(dm.messageKey(), message);
			params.put(dm.detailsKey(), details);
			
			Company company = new CompaniesDb(base, new CompanyNone()).get(companyDomain);
			params.put(dm.companyNameKey(), company.denomination());
			params.put(dm.companyDomainKey(), company.shortName());
			
			params.put(dm.moduleNameKey(), moduleType.toString());
			params.put(dm.moduleShortNameKey(), moduleType.shortName());
			
			User user = new UserNone();
			if(!StringUtils.isBlank(username))
				user = company.moduleAdmin().membership().user(username);
			
			params.put(dm.authorNameKey(), user.isNone() ? "N/A" : user.name());			
			params.put(dm.authorLoginKey(), user.isNone() ? "N/A" : user.username());
			
			params.put(dm.ipAddressKey(), ipAddress);
			
			UUID id = UUID.randomUUID();
			EventLogMetadata dm = EventLogMetadata.create();
			DomainsStore ds = base.domainsStore(dm);
			ds.set(id, params);
			
			base.commit();
		} catch (Exception ignore) {
			ignore.printStackTrace();
			base.rollback();
		}finally{
			base.terminate();
		}		
	}

	@Override
	public void info(String information, Object... args) {
		if(args.length > 0)
			information = String.format(information, args);
		
		add(LocalDateTime.now(), EventLogCategory.APPLICATION_LOG, EventLogType.INFORMATION, information, StringUtils.EMPTY);
	}

	@Override
	public void warning(String warning, Object... args) {
		
		if(args.length > 0)
			warning = String.format(warning, args);
		
		add(LocalDateTime.now(), EventLogCategory.APPLICATION_LOG, EventLogType.WARNING, warning, StringUtils.EMPTY);
	}

	@Override
	public void successAudit(String successMessage, Object... args) {
		if(args.length > 0)
			successMessage = String.format(successMessage, args);
		
		add(LocalDateTime.now(), EventLogCategory.SECURITY_LOG, EventLogType.SUCCESS_AUDIT, successMessage, StringUtils.EMPTY);
	}

	@Override
	public void failureAudit(String failureMessage, Object... args) {
		if(args.length > 0)
			failureMessage = String.format(failureMessage, args);
		
		add(LocalDateTime.now(), EventLogCategory.SECURITY_LOG, EventLogType.FAILURE_AUDIT, failureMessage, StringUtils.EMPTY);
	}

	@Override
	public void error(String error, String details) {
		
		if(StringUtils.isBlank(details))
			throw new IllegalArgumentException("Vous devez indiquer le détail de l'erreur !");
		
		add(LocalDateTime.now(), EventLogCategory.APPLICATION_LOG, EventLogType.ERROR, error, details);
	}

	@Override
	public Log ofModule(ModuleType moduleType) throws IOException {		
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}

	@Override
	public Log ofUser(String username) throws IOException {
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}

	@Override
	public Log of(EventLogCategory eventCategory) throws IOException {
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}

	@Override
	public Log of(EventLogType eventType) throws IOException {
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		EventLogMetadata evtDm = EventLogMetadata.create();
		String statement = String.format("%s log "
				+ "WHERE (log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ? OR log.%s ILIKE ?) AND %s=?",
				evtDm.domainName(), 
				evtDm.messageKey(), evtDm.detailsKey(), evtDm.companyNameKey(), evtDm.companyDomainKey(), evtDm.moduleNameKey(), evtDm.moduleShortNameKey(), evtDm.authorNameKey(), evtDm.authorLoginKey(), evtDm.ipAddressKey(), evtDm.companyDomainKey());
		
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add("%" + filter + "%");
		params.add(companyDomain);
		
		if(moduleType != ModuleType.NONE){
			statement = String.format("%s AND log.%s=?", statement, dm.moduleShortNameKey());
			params.add(moduleType.shortName());
		}
		
		if(!StringUtils.isBlank(username)){
			statement = String.format("%s AND log.%s=?", statement, dm.authorLoginKey());
			params.add(username);
		}
		
		if(eventCategory != EventLogCategory.NONE){
			statement = String.format("%s AND log.%s=?", statement, dm.categoryIdKey());
			params.add(eventCategory.id());
		}
		
		if(eventType != EventLogType.NONE){
			statement = String.format("%s AND log.%s=?", statement, dm.typeIdKey());
			params.add(eventType.id());
		}
		
		if(!StringUtils.isBlank(ipAddress)){
			statement = String.format("%s AND log.%s=?", statement, dm.ipAddressKey());
			params.add(ipAddress);
		}
		
		if(period.isDefined()){
			statement = String.format("%s AND log.%s::date BETWEEN ? AND ?", statement, dm.dateCreatedKey());
			params.add(java.sql.Date.valueOf(period.start()));
			params.add(java.sql.Date.valueOf(period.end()));
		}
		
		String orderClause = String.format("ORDER BY log.%s DESC", dm.dateCreatedKey());
		
		String keyResult = String.format("log.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected EventLog newOne(UUID id) {
		return new EventLogDb(base, id);
	}

	@Override
	public EventLog none() {
		return new EventLogNone();
	}

	@Override
	public Log of(Period period) throws IOException {
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}

	@Override
	public Log withIpAddress(String ipAddress) throws IOException {
		return new LogDb(base, companyDomain, moduleType, username, eventCategory, eventType, ipAddress, period);
	}
}
