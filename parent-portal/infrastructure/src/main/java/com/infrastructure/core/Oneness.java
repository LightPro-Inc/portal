package com.infrastructure.core;

public interface Oneness<TKey, TEntity> {
	TKey id();
	boolean isPresent();
	boolean isEqual(TEntity item);
	boolean isNotEqual(TEntity item);
}
