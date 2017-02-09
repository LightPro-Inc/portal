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
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.Secured;

@Path("/company")
public class CompanyRs extends AdminBaseRs {

	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getOwner() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.ok(new CompanyVm(currentCompany())).build();						
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/modulesAvailable")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesAvailable() throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany().modules().availables()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());

						return Response.ok(modulesVm).build();					
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/modulesInstalled")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesInstalled() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany().modules().installed()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());		

						return Response.ok(modulesVm).build();			
					}
				});			
	}
	
	@POST
	@Secured
	@Path("/module/{moduleType}/install")
	@Produces({MediaType.APPLICATION_JSON})
	public Response installModule(@PathParam("moduleType") int moduleTypeId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ModuleType type = ModuleType.get(moduleTypeId);
						Module module = currentCompany().modules().get(type);
						currentCompany().modules().install(module);
						
						return Response.status(Response.Status.OK).build();	
					}
				});					
	}
	
	@POST
	@Secured
	@Path("/module/{moduleTypeId}/uninstall")
	@Produces({MediaType.APPLICATION_JSON})
	public Response uninstallModule(@PathParam("moduleType") int moduleTypeId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ModuleType type = ModuleType.get(moduleTypeId);
						Module module = currentCompany().modules().get(type);
						currentCompany().modules().uninstall(module);
						
						return Response.status(Response.Status.OK).build();
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
						
						currentCompany().update(cmd.getDenomination(), 
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
