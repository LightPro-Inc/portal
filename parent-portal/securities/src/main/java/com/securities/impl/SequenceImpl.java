package com.securities.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.Horodate;
import com.infrastructure.core.impl.HorodateImpl;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainStore;
import com.securities.api.Sequence;
import com.securities.api.SequenceMetadata;

public class SequenceImpl implements Sequence {

	private final transient Base base;
	private final transient Object id;
	private final transient SequenceMetadata dm;
	private final transient DomainStore ds;
	
	public SequenceImpl(final Base base, final Object id){
		this.base = base;
		this.id = id;
		this.dm = dm();
		this.ds = this.base.domainsStore(this.dm).createDs(id);	
	}
	
	@Override
	public UUID id() {
		return UUIDConvert.fromObject(this.id);
	}

	@Override
	public Horodate horodate() {
		return new HorodateImpl(ds);
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
		
		synchronized (this){
			nextNumber = nextNumber();
			ds.set(dm.nextNumberKey(), nextNumber + step());
		}		
		
		code += StringUtils.leftPad(Long.toString(nextNumber), size(), "0");
		
		String suffix = suffix();
		if(StringUtils.isNotBlank(suffix))
			code += suffix;
		
		return code;
	}

	@Override
	public boolean isPresent() throws IOException {
		return base.domainsStore(dm).exists(id);
	}

	@Override
	public SequenceReserved code() throws IOException {
		int codeId = ds.get(dm.codeIdKey());
		return SequenceReserved.get(codeId);				
	}
}
