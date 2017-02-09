package com.infrastructure.core;

public interface Recordable<TKey, TEntity> extends Oneness<TKey, TEntity> {	
	Horodate horodate();	
}
