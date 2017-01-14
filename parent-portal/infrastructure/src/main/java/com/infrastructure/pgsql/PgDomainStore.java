package com.infrastructure.pgsql;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.datasource.DomainStore;

public class PgDomainStore implements DomainStore {

	private transient final PgBase base;
	private transient final Object key;
	private transient final DomainMetadata dm;
	
	public PgDomainStore(final PgBase base, final Object key, final DomainMetadata dm){
		this.base = base;
		this.key = key;
		this.dm = dm;
	}
	
	@Override
	public Object key() {
		return key;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> T get(String propertyKey) throws IOException {
		String statement = String.format("SELECT %s FROM %s WHERE %s=?", propertyKey, dm.domainName(), dm.keyName());    	
    	List<Object> values = this.base.executeQuery(statement, Arrays.asList(key)); 
    	
    	if(values.isEmpty())
    		throw new NotFoundException(String.format("La propriété %s n'a pas été trouvée !", propertyKey));
    	
    	return (T)values.get(0);
	}

	private void set(Map<String, Object> params, UUID author) throws IOException {
		
		if(params.isEmpty())
			throw new IOException("Vous devez spécifier un champ à modifier !");
		
		String clause = "";
		List<Object> values = new ArrayList<Object>();
		
		Set<String> keys = params.keySet();
		for (String string : keys) {
			clause += string + "=?,";
		}
		
		Collection<Object> elements = params.values();
		for (Object object : elements) {
			values.add(object);	
		}					
		
		String statement; 
				
	    if(author == null){
	    	clause = clause.substring(0, clause.lastIndexOf(","));
	    	statement = String.format("UPDATE %s SET %s WHERE %s=?", dm.domainName(), clause, dm.keyName());
	    }
	    else {
	    	values.add(author);
	    	statement = String.format("UPDATE %s SET %s lastmodifieddate=now(), lastmodifierid=? WHERE %s=?", dm.domainName(), clause, dm.keyName());
	    }
	    
	    values.add(key);
		this.base.executeUpdate(statement, values);
	}

	@Override
	public void set(Map<String, Object> params) throws IOException {		
		set(params, base.author());
	}

	@Override
	public DomainMetadata dm() {
		return dm;
	}

	@Override
	public void set(String propertyKey, Object value) throws IOException {
		set(propertyKey, value, base.author());
	}

	private void set(String propertyKey, Object value, UUID author) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(propertyKey, value);
		
		set(params, author);
	}
}
