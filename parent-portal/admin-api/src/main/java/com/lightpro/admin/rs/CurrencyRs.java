package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.core.PaginationSet;
import com.lightpro.admin.cmd.CurrencyEdited;
import com.lightpro.admin.vm.CurrencyVm;
import com.securities.api.Currencies;
import com.securities.api.Currency;
import com.securities.api.Secured;

@Path("/currency")
public class CurrencyRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAll() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<CurrencyVm> items = currentCompany.currencies().all()
														 .stream()
												 		 .map(m -> new CurrencyVm(m))
												 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response search( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Currencies container = currentCompany.currencies();
						
						List<CurrencyVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new CurrencyVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<CurrencyVm> pagedSet = new PaginationSet<CurrencyVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSingle(@PathParam("id") String id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						CurrencyVm item = new CurrencyVm(currentCompany.currencies().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(CurrencyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Currency item = currentCompany.currencies().add(cmd.id(), cmd.name(), cmd.symbol(), cmd.precision(), cmd.after());
						
						log.info(String.format("Création de la devise %s", item.name()));
						return Response.ok(new CurrencyVm(item)).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final String id, final CurrencyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Currency item = currentCompany.currencies().get(id);
						item.update(cmd.name(), cmd.symbol(), cmd.precision(), cmd.after());
						
						log.info(String.format("Mise à jour des données de la devise %s", item.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@DELETE
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response delete(@PathParam("id") final String id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Currency item = currentCompany.currencies().get(id);
						String name = item.name();
						currentCompany.currencies().delete(item);
						
						log.info(String.format("Suppression de la devise %s", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
