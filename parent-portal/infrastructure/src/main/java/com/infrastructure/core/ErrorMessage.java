package com.infrastructure.core;

import com.fasterxml.jackson.annotation.JsonGetter;

public class ErrorMessage {
	
	private final transient String title;
	private final transient String message;
	
	public ErrorMessage(String title, String message){
		this.title = title;
		this.message = message;
	}
	
	@JsonGetter
	public String getTitle(){
		return this.title;
	}
	
	@JsonGetter
	public String getMessage(){
		return this.message;
	}
}
