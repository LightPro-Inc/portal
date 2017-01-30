package com.infrastructure.core;

public interface Oneness<TKey, T> {
	TKey id();
	boolean isPresent();
	boolean isEqual(T item);
	boolean isNotEqual(T item);
}
