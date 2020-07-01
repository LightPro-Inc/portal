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

import com.lightpro.admin.cmd.MesureUnitEdited;
import com.lightpro.admin.vm.ListValueVm;
import com.lightpro.admin.vm.MesureUnitVm;
import com.securities.api.MesureUnit;
import com.securities.api.MesureUnitType;
import com.securities.api.Secured;

@Path("/mesure-unit")
public class MesureUnitRs extends AdminBaseRs {
		
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnits() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<MesureUnitVm> items = admin().mesureUnits().all()
								 .stream()
						 		 .map(m -> new MesureUnitVm(m))
						 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}	
	
	@GET
	@Secured
	@Path("/type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(MesureUnitType.values())
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
	@Path("/time")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitTimes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						
						List<MesureUnitVm> items = admin().mesureUnits().of(MesureUnitType.TIME).all()
														 .stream()
												 		 .map(m -> new MesureUnitVm(m))
												 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}	
	
	@GET
	@Secured
	@Path("/quantity")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitQuantities() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						
						List<MesureUnitVm> items = admin().mesureUnits().of(MesureUnitType.QUANTITY).all()
														 .stream()
												 		 .map(m -> new MesureUnitVm(m))
												 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnit(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnitVm item = new MesureUnitVm(admin().mesureUnits().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(final MesureUnitEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnit mesureUnit = admin().mesureUnits().add(cmd.shortName(), cmd.fullName(), cmd.type());
						
						log.info(String.format("Création de l'unité de mesure %s", mesureUnit.fullName()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final UUID id, final MesureUnitEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnit mesureUnit = admin().mesureUnits().get(cmd.id());						
						mesureUnit.update(cmd.shortName(), cmd.fullName(), cmd.type());
						
						log.info(String.format("Mise à jour de l'unité de mesure %s", mesureUnit.fullName()));
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
						
						MesureUnit mesureUnit = admin().mesureUnits().get(id);
						String name = mesureUnit.fullName();
						admin().mesureUnits().delete(mesureUnit);
						
						log.info(String.format("Suppression de l'unité de mesure %s", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
