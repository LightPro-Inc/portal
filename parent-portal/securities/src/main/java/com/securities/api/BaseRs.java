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
import com.securities.impl.MembershipImpl;

public abstract class BaseRs {
	
	private @Context SecurityContext securityContext;
	
	protected Membership membership() throws IOException {
		return new MembershipImpl(base());	
	}
	
	protected Company currentCompany() throws IOException {
		return currentUserOrDefault().company();
	}
	
	protected User currentUserOrDefault() throws IOException {
		Membership membership = new MembershipImpl(base());	
				
		if(securityContext.getUserPrincipal() == null)
			return membership.get("admin");					
			
		return membership.get(securityContext.getUserPrincipal().getName());
	}

	protected Base base() throws IOException {
		Base base = new PgBase();
		
		if(securityContext.getUserPrincipal() == null)
			return base;
		else
		{
			String username = securityContext.getUserPrincipal().getName();
			return base.build(username);
		}
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
}
