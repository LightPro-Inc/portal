package com.infrastructure.core;

import java.util.UUID;
import java.util.concurrent.Callable;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.infrastructure.datasource.Txn;
import com.infrastructure.pgsql.PgBase;

public abstract class BaseRs {
		
	protected transient PgBase base;
	
	public BaseRs(){
		UUID author = UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985");
		base = new PgBase(author);
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
			response = new Txn(base).call(
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
