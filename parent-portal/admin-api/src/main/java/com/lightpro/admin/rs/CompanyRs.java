package com.lightpro.admin.rs;

import java.io.IOException;


import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.cmd.CompanyEdited;
import com.lightpro.admin.vm.CompanyVm;
import com.lightpro.admin.vm.ModuleVm;

@Path("/company")
public class CompanyRs extends AdminBaseRs {

	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public Response getOwner() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.ok(new CompanyVm(company())).build();						
					}
				});			
	}
	
	@GET
	@Path("/modulesAvailable")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesAvailable() throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = company().modules().availables()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());

						return Response.ok(modulesVm).build();					
					}
				});		
	}
	
	@GET
	@Path("/modulesInstalled")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesInstalled() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = company().modules().installed()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());		

						return Response.ok(modulesVm).build();			
					}
				});			
	}
	
	@POST
	@Path("/module/{id}/install")
	@Produces({MediaType.APPLICATION_JSON})
	public Response installModule(@PathParam("id") String id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						company().modules().install(id);
						
						return Response.status(Response.Status.OK).build();	
					}
				});					
	}
	
	@POST
	@Path("/module/{id}/uninstall")
	@Produces({MediaType.APPLICATION_JSON})
	public Response uninstallModule(@PathParam("id") String id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						company().modules().uninstall(id);
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
	
	@PUT
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(final CompanyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						company().update(cmd.getDenomination(), 
									     cmd.rccm(), 
									     cmd.ncc(), 
									     cmd.siegeSocial(), 
									     cmd.bp(), 
									     cmd.tel(), 
									     cmd.fax(),
									     cmd.email(), 
									     cmd.webSite(), 
									     cmd.logo(),
									     cmd.currencyName(),
									     cmd.currencyShortName());
				
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
}
