package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Sequence;
import com.securities.api.SequenceMetadata;
import com.securities.api.Sequences;

public class SequencesImpl implements Sequences {

	private final transient Base base;
	private final transient SequenceMetadata dm;
	private final transient DomainsStore ds;
	
	public SequencesImpl(final Base base){
		this.base = base;
		this.dm = SequenceImpl.dm();
		this.ds = base.domainsStore(dm);
	}
	
	@Override
	public List<Sequence> all() throws IOException {
		return find(0, 0, "");
	}

	@Override
	public List<Sequence> find(String filter) throws IOException {
		return find(0, 0, filter);
	}

	@Override
	public List<Sequence> find(int page, int pageSize, String filter) throws IOException {
		List<Sequence> values = new ArrayList<Sequence>();
		
		HorodateMetadata hm = HorodateImpl.dm();
		String statement = String.format("SELECT %s FROM %s WHERE %s ILIKE ? ORDER BY %s DESC LIMIT ? OFFSET ?", dm.keyName(), dm.domainName(), dm.nameKey(), hm.dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		List<DomainStore> results = ds.findDs(statement, params);
		for (DomainStore domainStore : results) {
			values.add(new SequenceImpl(this.base, domainStore.key())); 
		}		
		
		return values;
	}

	@Override
	public int totalCount(String filter) throws IOException {
		String statement = String.format("SELECT COUNT(%s) FROM %s WHERE %s ILIKE ?", dm.keyName(), dm.domainName(), dm.nameKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());	
	}

	@Override
	public Sequence get(UUID id) throws IOException {
		if(!ds.exists(id))
			throw new NotFoundException("La séquence n'a pas été trouvé !");
		
		return new SequenceImpl(this.base, id);
	}

	@Override
	public Sequence add(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException {
		
		if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		if (step == 0) {
            throw new IllegalArgumentException("Invalid step : it can't be zero!");
        }
		
		if (nextNumber == 0) {
            throw new IllegalArgumentException("Invalid nextNumber : it can't be zero!");
        }
		
		if (size == 0) {
            throw new IllegalArgumentException("Invalid size : it can't be zero!");
        }
				
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.prefixKey(), prefix);
		params.put(dm.suffixKey(), suffix);
		params.put(dm.sizeKey(), size);
		params.put(dm.stepKey(), step);
		params.put(dm.nextNumberKey(), nextNumber);
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return new SequenceImpl(this.base, id);
	}

	@Override
	public void delete(Sequence item) throws IOException {
		ds.delete(item.id());
	}

	@Override
	public boolean exists(Object id) throws IOException {
		return ds.exists(id);
	}
}
