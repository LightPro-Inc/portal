package com.securities.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.GuidKeyEntityDb;
import com.infrastructure.datasource.Base;
import com.securities.api.Company;
import com.securities.api.Sequence;
import com.securities.api.SequenceMetadata;

public final class SequenceDb extends GuidKeyEntityDb<Sequence, SequenceMetadata> implements Sequence {

	private final transient LocalDate dateReference;
	
	public SequenceDb(final Base base, final UUID id){
		this(base, id, LocalDate.now());
	}
	
	public SequenceDb(final Base base, final UUID id, LocalDate dateReference){
		super(base, id, "Séquence introuvable !");
		this.dateReference = dateReference;
	}
	
	@Override
	public UUID id() {
		return this.id;
	}

	@Override
	public String name() throws IOException {
		return ds.get(dm.nameKey());
	}

	@Override
	public String prefix() throws IOException {
		return ds.get(dm.prefixKey());
	}

	@Override
	public String suffix() throws IOException {
		return ds.get(dm.suffixKey());
	}

	@Override
	public int size() throws IOException {
		return ds.get(dm.sizeKey());
	}

	@Override
	public int step() throws IOException {
		return ds.get(dm.stepKey());
	}

	@Override
	public long nextNumber() throws IOException {
		return ds.get(dm.nextNumberKey());		
	}

	@Override
	public void update(String name, String prefix, String suffix, int size, int step, long nextNumber) throws IOException {
		
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
		
		ds.set(params);
	}

	public static SequenceMetadata dm(){
		return new SequenceMetadata();
	}

	@Override
	public String generate() throws IOException {
		String code = "";
		
		String prefix = prefix();
		if(StringUtils.isNotBlank(prefix))
			code += prefix;
				
		long nextNumber;
		
		synchronized (company().id()){
			nextNumber = nextNumber();
			ds.set(dm.nextNumberKey(), nextNumber + step());
		}		
		
		int size = size();
		code += (size == 0) ? nextNumber : StringUtils.leftPad(Long.toString(nextNumber), size, "0");
		
		String suffix = suffix();
		if(StringUtils.isNotBlank(suffix))
			code += suffix;
		
		// changer les mots-clés par les valeurs
		// 1 - année
		code = code.replace("{year}", Integer.toString(dateReference.getYear()));
		
		// 2 - mois
		code = code.replace("{month}", StringUtils.leftPad(Integer.toString(dateReference.getMonthValue()), 2, "0"));
		
		// 3 - jour
		code = code.replace("{day}", StringUtils.leftPad(Integer.toString(dateReference.getDayOfMonth()), 2, "0"));
		
		return code;
	}

	@Override
	public SequenceReserved code() throws IOException {
		int codeId = ds.get(dm.codeIdKey());
		return SequenceReserved.get(codeId);				
	}

	@Override
	public Company company() throws IOException {
		UUID companyId = ds.get(dm.companyIdKey());
		return new CompanyDb(base, companyId);
	}

	@Override
	public Sequence withDateReference(LocalDate date) throws IOException {
		return new SequenceDb(base, id, date);
	}
}
