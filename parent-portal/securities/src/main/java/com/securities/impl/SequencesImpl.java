package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.NotFoundException;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.infrastructure.datasource.DomainsStore;
import com.securities.api.Company;
import com.securities.api.Sequence;
import com.securities.api.Sequence.SequenceReserved;
import com.securities.api.SequenceMetadata;
import com.securities.api.Sequences;

public class SequencesImpl implements Sequences {

	private final transient Base base;
	private final transient SequenceMetadata dm;
	private final transient DomainsStore ds;
	private final transient Company company;
	
	public SequencesImpl(final Base base, final Company company){
		this.base = base;
		this.dm = SequenceImpl.dm();
		this.ds = base.domainsStore(dm);
		this.company = company;
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
		String statement = String.format("SELECT %s FROM %s WHERE %s ILIKE ? AND %s=? ORDER BY %s DESC LIMIT ? OFFSET ?", dm.keyName(), dm.domainName(), dm.nameKey(), dm.companyIdKey(), hm.dateCreatedKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add(company.id());
		
		if(pageSize > 0){
			params.add(pageSize);
			params.add((page - 1) * pageSize);
		}else{
			params.add(null);
			params.add(0);
		}
		
		List<DomainStore> results = ds.findDs(statement, params);
		for (DomainStore domainStore : results) {
			values.add(build(UUIDConvert.fromObject(domainStore.key()))); 
		}		
		
		return values;
	}

	@Override
	public int totalCount(String filter) throws IOException {
		String statement = String.format("SELECT COUNT(%s) FROM %s WHERE %s ILIKE ? AND %s=? ", dm.keyName(), dm.domainName(), dm.nameKey(), dm.companyIdKey());
		
		List<Object> params = new ArrayList<Object>();
		filter = (filter == null) ? "" : filter;
		params.add("%" + filter + "%");
		params.add(company.id());
		
		List<Object> results = ds.find(statement, params);
		return Integer.parseInt(results.get(0).toString());	
	}

	@Override
	public Sequence get(UUID id) throws IOException {
		Sequence item = build(id);
		
		if(!contains(item))
			throw new NotFoundException("La séquence n'a pas été trouvé !");
		
		return build(id);
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
		params.put(dm.companyIdKey(), company.id());
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	public void delete(Sequence item) throws IOException {
		if(contains(item))
			ds.delete(item.id());
	}

	@Override
	public boolean contains(Sequence item) {
		try {
			return item.isPresent() && item.company().isEqual(company);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public Sequence build(UUID id) {
		return new SequenceImpl(this.base, id);
	}

	@Override
	public Sequence reserved(SequenceReserved code) throws IOException {
		List<Object> values = ds.find(String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.codeIdKey(), dm.companyIdKey()), Arrays.asList(code.id(), company.id()));
		
		if(values.isEmpty())
		{
			switch (code) {
			case PURCHASE_ORDER:
				return add("Devis séquence", "DE", "", 9, 1, 1);
			case INVOICE:
				return add("Facture séquence", "FAC", "", 9, 1, 1);
			case PAYMENT:
				return add("Règlement séquence", "PAY", "", 9, 1, 1);
			case PDV_SESSION:
				return add("Pdv session séquence", "PDV", "", 9, 1, 1);
			default:
				throw new IllegalArgumentException(String.format("%s : séquence réservée non prise en charge !", code.toString()));				
			}
		}
		
		return new SequenceImpl(base, UUIDConvert.fromObject(values.get(0)));
	}
}
