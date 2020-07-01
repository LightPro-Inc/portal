package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.Nonable;

public interface Company extends Nonable {
	
	UUID id();
	String denomination() throws IOException;
	String shortName() throws IOException;
	String rccm() throws IOException;
	String ncc() throws IOException;
	String siegeSocial() throws IOException;
	String bp() throws IOException;
	String tel() throws IOException;
	String fax() throws IOException;
	String email() throws IOException;
	String webSite() throws IOException;
	String logo() throws IOException;
	Currency currency() throws IOException;
	
	void update(String denomination,
				String shortName,
	            String rccm, 
	            String ncc, 
	            String siegeSocial, 
	            String bp, 
	            String tel,
	            String fax,
	            String email, 
	            String webSite, 
	            String logo,
	            Currency currency) throws IOException;
	
	void changeLogo(String logo) throws IOException;
	Admin moduleAdmin() throws IOException;
	
	Features features() throws IOException;
	
	Modules modulesProposed() throws IOException;
	Modules modulesSubscribed() throws IOException;
	Modules modulesInstalled() throws IOException;
	Modules modulesSubscribedNotInstalled() throws IOException;
	
	Indicators indicators() throws IOException;
	Log log() throws IOException;
	Currencies currencies() throws IOException;
}
