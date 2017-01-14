package com.infrastructure.core;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.Callable;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.infrastructure.pgsql.PgBase;

public abstract class BaseRs {
		
	protected transient PgBase base;
	
	public BaseRs(){
		UUID author = UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985");
		base = new PgBase(author);
	}
	
	protected Response createHttpResponse(Callable<Response> callable){	
					
		Response response = null;
		
		try
		{
			base.beginTransaction();
			
			response = callable.call();		
			
			base.commit();
		}
		catch (IllegalArgumentException ex)
		{
			try {
				base.rollback();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			ex.printStackTrace();
			response = Response.status(Status.BAD_REQUEST)
						       .entity(new ErrorMessage("Erreur de requête", ex.getMessage()))
						       .build();
		}
		catch (Exception ex)
		{
			try {
				base.rollback();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			ex.printStackTrace();
			response = Response.status(Status.INTERNAL_SERVER_ERROR)
							   .entity(new ErrorMessage("Erreur fatale", ex.getMessage()))
							   .build();
		}finally{
			try {
				base.terminate();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return response;
	}
}
