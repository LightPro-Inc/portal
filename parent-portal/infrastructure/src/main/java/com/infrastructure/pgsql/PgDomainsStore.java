package com.infrastructure.pgsql;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.Base.OrderDirection;

public class PgDomainsStore implements DomainsStore {

	private transient final PgBase base;
	private transient final DomainMetadata dm;
	
	public PgDomainsStore(final PgBase base, final DomainMetadata dm) {
		this.base = base;
		this.dm = dm;
	}
	
	@Override
	public DomainStore createDs(Object key) {
		return new PgDomainStore(this.base, key, dm);
	}

	@Override
	public List<DomainStore> getAll() throws IOException {		
		return getAllOrdered(null, null);
	}

	private void set(Object key, Map<String, Object> params, UUID author) throws IOException {
		
		/*if(params.isEmpty())
			throw new IOException("Vous devez spécifier un champ à modifier !");*/
		
		String clause = "";
		String clauseSet = "";
		List<Object> values = new ArrayList<Object>();
		
		Set<String> keys = params.keySet();
		for (String string : keys) {
			clause += string + ",";	
			clauseSet += "?,";
		}
		
		if(!params.isEmpty()){
			clause = clause.substring(0, clause.lastIndexOf(","));
			clauseSet = clauseSet.substring(0, clauseSet.lastIndexOf(","));
		}		
		
		Collection<Object> elements = params.values();
		for (Object object : elements) {
			values.add(object);
		}
								
		String statement; 
		
	    if(author == null){	    	
	    	statement = String.format("INSERT INTO %s (%s, %s) VALUES (%s, ?)", dm.domainName(), clause, dm.keyName(), clauseSet);
	    }
	    else {
	    	values.add(author);
	    	values.add(author);
	    	
	    	if(clause.isEmpty())
	    		statement = String.format("INSERT INTO %s (ownerid, lastmodifierid, datecreated, lastmodifieddate, %s) VALUES (?, ?, now(), now(), ?)", dm.domainName(), dm.keyName(), clauseSet);
	    	else
	    		statement = String.format("INSERT INTO %s (%s, ownerid, lastmodifierid, datecreated, lastmodifieddate, %s) VALUES (%s, ?, ?, now(), now(), ?)", dm.domainName(), clause, dm.keyName(), clauseSet);
	    }
	    
	    values.add(key);
		this.base.executeUpdate(statement, values);
	}
	
	@Override
	public void set(Object key, Map<String, Object> params) throws IOException {
		if(base.keyExists("ownerid", dm.domainName()))
			set(key, params, base.author());
		else
			set(key, params, null);
	}

	@Override
	public boolean exists(Object key) {
		return exists(dm.keyName(), key);
	}

	@Override
	public void delete(Object key) throws IOException {
		String statement = String.format("DELETE FROM %s WHERE %s=?", dm.domainName(), dm.keyName());		
		this.base.executeUpdate(statement, Arrays.asList(key));
	}

	@Override
	public DomainMetadata dm() {
		return this.dm;
	}

	@Override
	public List<DomainStore> findDs(String statement, List<Object> params) throws IOException {
		  	
    	List<Object> values = this.base.executeQuery(statement, params);
    	
    	List<DomainStore> domainsStore = new ArrayList<DomainStore>();
    	for (Object key : values) {
			domainsStore.add(new PgDomainStore(this.base, key, dm));
		}
    	
    	return domainsStore;
	}
	
	@Override
	public List<Object> find(String statement, List<Object> params) throws IOException {		  
    	return this.base.executeQuery(statement, params);
	}

	@Override
	public void execute(String statement, List<Object> params) throws IOException {
		this.base.executeUpdate(statement, params); 
	}

	@Override
	public List<DomainStore> getAllOrdered(String orderKey, OrderDirection direction) throws IOException {
		String statement;
		
		if(orderKey == null)
			statement = String.format("SELECT %s FROM %s", dm.keyName(), dm.domainName());
		else{
			
			if(direction == OrderDirection.ASC)
				statement = String.format("SELECT %s FROM %s ORDER BY %s ASC", dm.keyName(), dm.domainName(), orderKey);
			else
				statement = String.format("SELECT %s FROM %s ORDER BY %s DESC", dm.keyName(), dm.domainName(), orderKey);
		}
		
    	List<Object> values = this.base.executeQuery(statement, new ArrayList<Object>());
    	
    	List<DomainStore> domainsStore = new ArrayList<DomainStore>();
    	for (Object id : values) {
			domainsStore.add(new PgDomainStore(this.base, id, dm));
		}
    	
    	return domainsStore;
	}

	@Override
	public List<DomainStore> getAllByKeyOrdered(String key, Object keyValue, String orderKey, OrderDirection direction) throws IOException {
		String statement;
		
		if(orderKey == null)
			statement = String.format("SELECT %s FROM %s WHERE %s=?", dm.keyName(), dm.domainName(), key);
		else{
			
			if(direction == OrderDirection.ASC)
				statement = String.format("SELECT %s FROM %s WHERE %s=? ORDER BY %s ASC", dm.keyName(), dm.domainName(), key, orderKey);
			else
				statement = String.format("SELECT %s FROM %s WHERE %s=? ORDER BY %s DESC", dm.keyName(), dm.domainName(), key, orderKey);
		}
		
    	List<Object> values = this.base.executeQuery(statement, Arrays.asList(keyValue));
    	    	
    	List<DomainStore> domainsStore = new ArrayList<DomainStore>();
    	for (Object id : values) {
			domainsStore.add(new PgDomainStore(this.base, id, dm));
		}
    	
    	return domainsStore;
	}

	@Override
	public List<DomainStore> getAllByKey(String key, Object keyValue) throws IOException {
		return getAllByKeyOrdered(key, keyValue, null, null);
	}

	@Override
	public boolean exists(String key, Object keyValue) {
		String statement = String.format("SELECT * FROM %s WHERE %s=?", dm.domainName(), key);		
		List<Object> values;
		try {
			values = this.base.executeQuery(statement, Arrays.asList(keyValue));
			return !values.isEmpty();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;		
	}

	@Override
	public long count(String statement, List<Object> params) throws IOException {
		List<Object> results = find(statement, params);
		return Long.parseLong(results.get(0).toString());
	}

	@Override
	public Optional<Object> getFirst(String statement, List<Object> params) throws IOException {
		List<Object> results = find(statement, params);		
		return results.stream().findFirst();
	}

	@Override
	public Optional<DomainStore> getFirstDs(String statement, List<Object> params) throws IOException {
		List<DomainStore> results = findDs(statement, params);		
		return results.stream().findFirst();
	}

	@Override
	public boolean exists(String key1, Object value1, String key2, Object value2) {
		String statement = String.format("SELECT * FROM %s WHERE %s=? AND %s=?", dm.domainName(), key1, key2);		
		List<Object> values;
		try {
			values = this.base.executeQuery(statement, Arrays.asList(value1, value2));
			return !values.isEmpty();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;	
	}

	@Override
	public List<Object> findPagined(String statement, List<Object> params, int page, int pageSize) throws IOException {
		
		statement += " LIMIT ? OFFSET ?";
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		return find(statement, params);
	}
}
