package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.core.PaginationSet;
import com.lightpro.admin.cmd.ActivateModule;
import com.lightpro.admin.vm.IndicatorVm;
import com.lightpro.admin.vm.ListValueVm;
import com.lightpro.admin.vm.ModuleVm;
import com.securities.api.Module;
import com.securities.api.ModuleStatus;
import com.securities.api.ModuleType;
import com.securities.api.Modules;
import com.securities.api.Secured;


@Path("/module")
public class MyModuleRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Path("/type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAllTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(ModuleType.values())
								.stream()
								.filter(m -> m.id()>0)
								.map(m -> new ListValueVm(m.id(), m.toString()))
								.collect(Collectors.toList());
						
						return Response.ok(items).build();
					}
				});		
	}
	
	@GET
	@Path("/{moduleTypeId}/indicator")
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModuleIndicators(@PathParam("moduleTypeId") final int moduleTypeId) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ModuleType moduleType = ModuleType.get(moduleTypeId);
						List<IndicatorVm> items = /*currentUser().indicators().of(moduleType)*/currentCompany.modulesInstalled().get(moduleType).indicators().all()
																 .stream()
														 		 .map(m -> new IndicatorVm(m))
														 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Path("/general-indicator")
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getGeneralIndicators() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<IndicatorVm> items = currentUser.indicators().all()
																 .stream()
														 		 .map(m -> new IndicatorVm(m))
														 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/{moduleTypeId}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSingleModuleSubscribed(@PathParam("id") final Integer moduleTypeId) throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Module item = currentCompany.modulesSubscribed().get(moduleTypeId);

						return Response.ok(new ModuleVm(item)).build();					
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/subscribed")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesSubscribed() throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany.modulesSubscribed().all()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());

						return Response.ok(modulesVm).build();					
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/subscribed/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response searchSubscribed( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Modules container = currentCompany.modulesSubscribed();
						
						List<ModuleVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ModuleVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ModuleVm> pagedSet = new PaginationSet<ModuleVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/available")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesAvailable() throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany.modulesSubscribedNotInstalled().all()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());

						return Response.ok(modulesVm).build();					
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/available/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response searchAvailables( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Modules container = currentCompany.modulesSubscribedNotInstalled();
						
						List<ModuleVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ModuleVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ModuleVm> pagedSet = new PaginationSet<ModuleVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/installed")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesInstalled() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany.modulesInstalled().all()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());		

						return Response.ok(modulesVm).build();			
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/installed/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response searchInstalled( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Modules container = currentCompany.modulesInstalled();
						
						List<ModuleVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ModuleVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ModuleVm> pagedSet = new PaginationSet<ModuleVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/used")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesUsed() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ModuleVm> modulesVm = currentCompany.modulesInstalled().of(ModuleStatus.ACTIVATED).all()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());		

						return Response.ok(modulesVm).build();			
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/used-by-user")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModulesUsedByUser() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						List<ModuleVm> modulesVm = currentUser.modules()
								.stream()
						 		.map(m -> new ModuleVm(m))
						 		.collect(Collectors.toList());		

						return Response.ok(modulesVm).build();			
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/used/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response searchUsed( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Modules container = currentCompany.modulesInstalled().of(ModuleStatus.ACTIVATED);
						
						List<ModuleVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ModuleVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ModuleVm> pagedSet = new PaginationSet<ModuleVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@POST
	@Secured
	@Path("/{moduleType}/install")
	@Produces({MediaType.APPLICATION_JSON})
	public Response installModule(@PathParam("moduleType") int moduleTypeId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Module module = currentCompany.modulesSubscribed().get(moduleTypeId);
						module.install();
						
						log.info(String.format("Installation du module %s", ModuleType.ADMIN));
						return Response.status(Response.Status.OK).build();	
					}
				});					
	}
	
	@POST
	@Secured
	@Path("/{moduleTypeId}/uninstall")
	@Produces({MediaType.APPLICATION_JSON})
	public Response uninstallModule(@PathParam("moduleType") int moduleTypeId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
											
						Module module = currentCompany.modulesInstalled().get(moduleTypeId);
						module.uninstall();
						
						log.info(String.format("Désinstallation du module %s", ModuleType.ADMIN));
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
	
	@POST
	@Secured
	@Path("/{moduleType}/use")
	@Produces({MediaType.APPLICATION_JSON})
	public Response activateModule(@PathParam("moduleType") final int moduleTypeId, final ActivateModule cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
									
						Module module = currentCompany.modulesInstalled().get(moduleTypeId);
						module.activate(cmd.isUsed());
						
						if(cmd.isUsed())
							log.info(String.format("Activation du module %s", module.type()));
						else
							log.info(String.format("Désactivation du module %s", module.type()));
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
}
