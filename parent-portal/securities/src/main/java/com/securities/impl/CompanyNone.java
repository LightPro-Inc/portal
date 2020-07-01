package com.securities.impl;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.EntityNone;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.Currencies;
import com.securities.api.Currency;
import com.securities.api.Features;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Modules;

public final class CompanyNone extends EntityNone<Company, UUID> implements Company {

	@Override
	public String denomination() throws IOException {
		return "Non identifié";
	}

	@Override
	public String shortName() throws IOException {
		return null;
	}

	@Override
	public String rccm() throws IOException {
		return null;
	}

	@Override
	public String ncc() throws IOException {
		return null;
	}

	@Override
	public String siegeSocial() throws IOException {
		return null;
	}

	@Override
	public String bp() throws IOException {
		return null;
	}

	@Override
	public String tel() throws IOException {
		return null;
	}

	@Override
	public String fax() throws IOException {
		return null;
	}

	@Override
	public String email() throws IOException {
		return null;
	}

	@Override
	public String webSite() throws IOException {
		return null;
	}

	@Override
	public String logo() throws IOException {
		return null;
	}

	@Override
	public void changeLogo(String logo) throws IOException {
		throw new UnsupportedOperationException("Vous ne pouvez pas changer le logo d'une entreprise non identifiée !");
	}

	@Override
	public Admin moduleAdmin() throws IOException {
		return null;
	}

	@Override
	public void update(String denomination, String shortName, String rccm, String ncc, String siegeSocial, String bp,
			String tel, String fax, String email, String webSite, String logo, Currency currency) throws IOException {

	}

	@Override
	public Features features() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Modules modulesSubscribedNotInstalled() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}
	
	@Override
	public Modules modulesSubscribed() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}
	
	@Override
	public Modules modulesProposed() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Modules modulesInstalled() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}

	@Override
	public Indicators indicators() throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Log log() throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Currency currency() throws IOException {
		return new CurrencyNone();
	}

	@Override
	public Currencies currencies() throws IOException {
		throw new UnsupportedOperationException("Opération non supportée !");
	}
}
