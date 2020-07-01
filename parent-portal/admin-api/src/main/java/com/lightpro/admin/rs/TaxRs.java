package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.cmd.TaxEdited;
import com.lightpro.admin.vm.ListValueVm;
import com.lightpro.admin.vm.TaxVm;
import com.securities.api.NumberValueType;
import com.securities.api.Secured;
import com.securities.api.Tax;
import com.securities.api.TaxType;

@Path("/tax")
public class TaxRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Path("/vat")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAllTva() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<TaxVm> items = admin().taxes().getVatTaxes()
													 .stream()
											 		 .map(m -> new TaxVm(m))
											 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAll() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<TaxVm> items = admin().taxes().all()
													 .stream()
											 		 .map(m -> new TaxVm(m))
											 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getTaxTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(TaxType.values())
													 .stream()
													 .filter(m -> m.id() > 0) 
											 		 .map(m -> new ListValueVm(m.id(), m.toString()))
											 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/value-type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getTaxValueTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(NumberValueType.values())
													 .stream()
											 		 .map(m -> new ListValueVm(m.id(), m.toString()))
											 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSingle(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						TaxVm item = new TaxVm(admin().taxes().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(TaxEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Tax tax = admin().taxes().add(cmd.type(), cmd.name(), cmd.shortName(), cmd.value(), cmd.valueType());
						
						log.info(String.format("Création de la taxe %s.", tax.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final UUID id, final TaxEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Tax item = admin().taxes().get(id);
						item.update(cmd.type(), cmd.name(), cmd.shortName(), cmd.value(), cmd.valueType());
						
						log.info(String.format("Mise à jour de la taxe %s.", item.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@DELETE
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response delete(@PathParam("id") final UUID id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Tax item = admin().taxes().get(id);
						String name = item.name();
						admin().taxes().delete(item);
						
						log.info(String.format("Suppression de la taxe %s.", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
