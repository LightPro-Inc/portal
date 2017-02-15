package com.securities.api;

import java.io.IOException;
import java.util.concurrent.Callable;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.Status;

import com.infrastructure.core.ErrorMessage;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.Txn;
import com.infrastructure.pgsql.PgBase;
import com.securities.impl.CompaniesImpl;
import com.securities.impl.MembershipImpl;

public abstract class BaseRs {
	
	private @Context SecurityContext securityContext;
	
	private boolean isUsernamePresent() throws IOException {
		return securityContext.getUserPrincipal() != null; 
	}
	
	private String companyShortName() throws IOException {
		return getCompanyShortName(fullUsername());
	}
	
	protected String getUsername(String fullUsername) throws IOException {
		String username = fullUsername;
		String[] usernameParts = username.split("@");
		return usernameParts[0];
	}
	
	private String username() throws IOException {
		return getUsername(fullUsername());
	}

	private String fullUsername() throws IOException {
		if(!isUsernamePresent())
			throw new IllegalArgumentException("L'utilisateur doit être identifé avant de continuer l'action !");
		
		return securityContext.getUserPrincipal().getName();
	}
	
	protected boolean hasValidCompany(String fullUsername) throws IOException {
		String companyShortName = getCompanyShortName(fullUsername);
		Companies companies = new CompaniesImpl(base());
		return companies.isPresent(companyShortName);
	}
	
	protected Membership membership() throws IOException {
		return currentCompany().membership();	
	}
	
	protected Membership membership(String fullUsername) throws IOException {
		
		String companyShortName = getCompanyShortName(fullUsername);
		Company company = getCompany(companyShortName);
		
		return new MembershipImpl(base(), company);		
	}
	
	private Company getCompany(String companyShortName) throws IOException {
		Companies companies = new CompaniesImpl(base());
		return companies.get(companyShortName);
	}
	
	private String getCompanyShortName(String fullUsername) throws IOException {
		String username = fullUsername;
		String[] usernameParts = username.split("@");
		return usernameParts[usernameParts.length - 1];
	}
	
	protected Company currentCompany() throws IOException {
		return getCompany(companyShortName());		
	}
	
	protected User currentUser() throws IOException {

		Membership membership = new MembershipImpl(base(), currentCompany());			
		return membership.get(username());
	}

	protected Base base() throws IOException {
		Base base = new PgBase();
		
		if(!isUsernamePresent())
			return base;
		else
			return base.build(username());
	}
	
	protected Response createNonTransactionalHttpResponse(Callable<Response> callable){	
		
		Response response = null;
		
		try
		{
			response = callable.call();		
		}
		catch (IllegalArgumentException ex)
		{
			ex.printStackTrace();
			response = Response.status(Status.BAD_REQUEST)
						       .entity(new ErrorMessage("Erreur de requête", ex.getMessage()))
						       .build();
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			response = Response.status(Status.INTERNAL_SERVER_ERROR)
							   .entity(new ErrorMessage("Erreur fatale", ex.getMessage()))
							   .build();
		}
		
		return response;
	}
	
	protected Response createHttpResponse(Callable<Response> callable){	
			
		Response response;
		
		try
		{							
			response = new Txn(base()).call(
					new Callable<Response>(){
						@Override
						public Response call() throws Exception {
							return callable.call();	
						}
					}
				);	
		}
		catch (IllegalArgumentException ex)
		{
			ex.printStackTrace();
			response = Response.status(Status.BAD_REQUEST)
						       .entity(new ErrorMessage("Mauvaise requête", ex.getMessage()))
						       .build();
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			response = Response.status(Status.INTERNAL_SERVER_ERROR)
							   .entity(new ErrorMessage("Erreur fatale", ex.getMessage()))
							   .build();
		}
		
		return response;
	}
}
