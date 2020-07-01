package com.infrastructure.core;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.QueryBuilder;

public abstract class AdvancedQueryableDb<T, TKey, TMetadata> extends QueryableDb<T, TKey, TMetadata> implements AdvancedQueryable<T, TKey>, Updatable<T> {
	
	public AdvancedQueryableDb(final Base base, final String msgNotFound){
		super(base, msgNotFound);
	}
	
	protected abstract QueryBuilder buildQuery(String filter) throws IOException;
	protected abstract TKey convertKey(Object id);
	
	@Override
	public List<T> all() throws IOException {
		return find("");
	}
	
	@Override
	public List<T> find(String filter) throws IOException {
		return find(0, 0, filter);
	}
	
	@Override
	public List<T> find(int page, int pageSize, String filter) throws IOException {
		
		return  buildQuery(filter).find(page, pageSize)
				  .stream()
				  .map(m -> {
					try {
						return get(convertKey(m));
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				})
				  .collect(Collectors.toList());
	}
	
	@Override
	public long count(String filter) throws IOException {
		return buildQuery(filter).count();
	}
	
	@Override
	public long count() throws IOException {
		return buildQuery(StringUtils.EMPTY).count();
	}
	
	@Override
	public boolean contains(T item) {
		try {
			return buildQuery(StringUtils.EMPTY).exists(((DomainMetadata)dm).keyName(), idOf(item));
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
}
