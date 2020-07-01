package com.securities.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.AdvancedQueryableDb;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;
import com.securities.api.Company;
import com.securities.api.Sequence;
import com.securities.api.Sequence.SequenceReserved;
import com.securities.api.SequenceMetadata;
import com.securities.api.Sequences;

public class SequencesDb extends AdvancedQueryableDb<Sequence, UUID, SequenceMetadata> implements Sequences {

	private final transient Company company;
	
	public SequencesDb(final Base base, final Company company){
		super(base, "Séquence introuvable !");
		this.company = company;
	}

	@Override
	public Sequence add(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException {
		return add(name, prefix, suffix, size, step, nextNumber, 0);		
	}

	@Override
	public boolean contains(Sequence item) {
		try {
			return item.id() != null && item.company().equals(company);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public Sequence reserved(SequenceReserved code) throws IOException {
		List<Object> values = ds.find(String.format("SELECT %s FROM %s WHERE %s=? AND %s=?", dm.keyName(), dm.domainName(), dm.codeIdKey(), dm.companyIdKey()), Arrays.asList(code.id(), company.id()));
				
		if(values.isEmpty())
		{
			switch (code) {
			case PURCHASE_ORDER:
				return add("Devis séquence", "DE", "", 9, 1, 1, SequenceReserved.PURCHASE_ORDER.id());				
			case INVOICE:
				return add("Facture séquence", "FAC", "", 9, 1, 1, SequenceReserved.INVOICE.id());
			case PAYMENT:
				return add("Règlement séquence", "PAY", "", 9, 1, 1, SequenceReserved.PAYMENT.id());				
			case PDV_SESSION:
				return add("Pdv session séquence", "PDV", "", 9, 1, 1, SequenceReserved.PDV_SESSION.id());
			case PROVISION:
				return add("Provision séquence", "PRO", "", 9, 1, 1, SequenceReserved.PROVISION.id());		
			default:
				throw new IllegalArgumentException(String.format("%s : séquence réservée non prise en charge !", code.toString()));				
			}
		}
		
		return new SequenceDb(base, UUIDConvert.fromObject(values.get(0)));
	}

	@Override
	public Sequence add(String name, String prefix, String suffix, int size, int step, long nextNumber, int code) throws IOException {
		
		if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Invalid name : it can't be empty!");
        }
		
		if (step == 0) {
            throw new IllegalArgumentException("Invalid step : it can't be zero!");
        }
		
		if (nextNumber == 0) {
            throw new IllegalArgumentException("Invalid nextNumber : it can't be zero!");
        }
		
		if (size < 0) {
            throw new IllegalArgumentException("Invalid size : it can't be negative !");
        }
				
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(dm.nameKey(), name);
		params.put(dm.prefixKey(), prefix);
		params.put(dm.suffixKey(), suffix);
		params.put(dm.sizeKey(), size);
		params.put(dm.stepKey(), step);
		params.put(dm.nextNumberKey(), nextNumber);
		params.put(dm.companyIdKey(), company.id());
		params.put(dm.codeIdKey(), code);
		
		UUID id = UUID.randomUUID();
		ds.set(id, params);
		
		return build(id);
	}

	@Override
	protected QueryBuilder buildQuery(String filter) throws IOException {
		List<Object> params = new ArrayList<Object>();
		filter = StringUtils.defaultString(filter);
		
		String statement = String.format("%s seq "
				+ "WHERE seq.%s ILIKE ? AND seq.%s=?",
				dm.domainName(), 
				dm.nameKey(), dm.companyIdKey());
		
		params.add("%" + filter + "%");
		params.add(company.id());
		
		HorodateMetadata horodateDm = HorodateMetadata.create();
		String orderClause = String.format("ORDER BY seq.%s DESC", horodateDm.dateCreatedKey());
		
		String keyResult = String.format("seq.%s", dm.keyName());
		return base.createQueryBuilder(ds, statement, params, keyResult, orderClause);
	}

	@Override
	protected UUID convertKey(Object id) {
		return UUIDConvert.fromObject(id);
	}

	@Override
	protected Sequence newOne(UUID id) {
		return new SequenceDb(base, id);
	}

	@Override
	public Sequence none() {
		return new SequenceNone();
	}
}
