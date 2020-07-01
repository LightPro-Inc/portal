package com.infrastructure.core;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonGetter;

public class PaginationSet<T> {
	private final int page;
	private final List<T> items;
	private final long totalCount;
	
	public PaginationSet(final List<T> items, final int page, final long totalCount){
		this.items = items;
		this.page = page;
		this.totalCount = totalCount;
	}
	
	@JsonGetter
	public int getPage(){
		return this.page;
	}
	
	@JsonGetter
	public List<T> getItems(){
		return this.items;
	}
	
	@JsonGetter
	public long getTotalCount(){
		return this.totalCount;
	}
}
