package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.concurrent.Callable;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.cmd.CompanyEdited;
import com.lightpro.admin.vm.CompanyVm;
import com.securities.api.Currency;
import com.securities.api.Secured;

@Path("/company")
public class MyCompanyRs extends AdminBaseRs {

	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getOwner() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.ok(new CompanyVm(currentCompany)).build();						
					}
				});			
	}	
	
	@PUT
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(final CompanyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Currency currency = currentCompany.currencies().build(cmd.currencyId());
						
						currentCompany.update(cmd.getDenomination(), 
										 cmd.shortName(),
									     cmd.rccm(), 
									     cmd.ncc(), 
									     cmd.siegeSocial(), 
									     cmd.bp(), 
									     cmd.tel(), 
									     cmd.fax(),
									     cmd.email(), 
									     cmd.webSite(), 
									     cmd.logo(),
									     currency);
				
						log.info(String.format("Mise à jour de l'entreprise %s", cmd.getDenomination()));
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
}
