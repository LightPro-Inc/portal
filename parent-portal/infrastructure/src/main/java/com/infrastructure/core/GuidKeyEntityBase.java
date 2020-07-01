package com.infrastructure.core;

import java.util.UUID;

public abstract class GuidKeyEntityBase<T> extends EntityBase<T, UUID> {

	public GuidKeyEntityBase(UUID id) {
		super(id);
	}
}
