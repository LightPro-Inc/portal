package com.lightpro.admin.vm;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import com.securities.api.EventLog;

final public class EventLogVm {
	
	public final UUID id;
	public final LocalDateTime date;
	public final String category;
	public final int categoryId;
	public final String type;
	public final int typeId;
	public final String message;
	public final String details;
	public final String company;
	public final String module;
	public final String author;
	public final String authorUsername;
	public final String ipAddress;	
	
	public EventLogVm() {
        throw new UnsupportedOperationException("#EventLogVm()");
    }
	
	public EventLogVm(final EventLog origin) {
		try {
			this.id = origin.id();
	        this.date = origin.date();
	        this.category = origin.category().toString();
	        this.categoryId = origin.category().id();
	        this.type = origin.type().toString();
	        this.typeId = origin.type().id();
	        this.message = origin.message();
	        this.details = origin.details();
	        this.company = origin.company();
	        this.module = origin.module();
	        this.author = origin.author();
	        this.authorUsername = origin.authorUsername();
	        this.ipAddress = origin.ipAddress();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}	        
    }
}
