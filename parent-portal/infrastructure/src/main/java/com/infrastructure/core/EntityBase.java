package com.infrastructure.core;

import java.util.Objects;

import com.infrastructure.core.impl.EqualityByID;

public abstract class EntityBase<T, TKey> implements Nonable {
	
	protected final transient TKey id;
	/*protected final transient Log log;*/
	
	public EntityBase(final TKey id/*, final Log log*/) {		
		this.id = id;		
		/*this.log = log;*/
	}
	
	public TKey id(){
		return id;
	}
	
	@Override
	public boolean equals(Object o){
		@SuppressWarnings("unchecked")
		Equalable equalable = new EqualityByID<T>((T)this);
		return equalable.equals(o);
	}
	
	@Override
	public int hashCode(){
		return Objects.hashCode(id);
	}
	
	@Override
	public boolean isNone(){
		return id == null;
	}
}
