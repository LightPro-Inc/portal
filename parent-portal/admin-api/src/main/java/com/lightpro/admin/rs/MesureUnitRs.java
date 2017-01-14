package com.lightpro.admin.rs;

import java.io.IOException;
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
import com.lightpro.admin.vm.MesureUnitTypeVm;
import com.lightpro.admin.vm.MesureUnitVm;
import com.securities.api.MesureUnit;
import com.securities.impl.MesureUnitTypeImpl;

@Path("/mesure-unit")
public class MesureUnitRs extends AdminBaseRs {
		
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnits() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<MesureUnitVm> items = company().mesureUnits().items()
								 .stream()
						 		 .map(m -> new MesureUnitVm(m))
						 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}	
	
	@GET
	@Path("/type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<MesureUnitTypeVm> items = company().mesureUnitTypes().all()
															 .stream()
													 		 .map(m -> new MesureUnitTypeVm(m))
													 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}	
	
	@GET
	@Path("/time")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitTimes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						
						List<MesureUnitVm> items = company().mesureUnits().find(MesureUnitTypeImpl.TIME)
														 .stream()
												 		 .map(m -> new MesureUnitVm(m))
												 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}	
	
	@GET
	@Path("/quantity")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnitQuantities() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						
						List<MesureUnitVm> items = company().mesureUnits().find(MesureUnitTypeImpl.QUANTITY)
														 .stream()
												 		 .map(m -> new MesureUnitVm(m))
												 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMesureUnit(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnitVm item = new MesureUnitVm(company().mesureUnits().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(final MesureUnitEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						company().mesureUnits().add( cmd.shortName(), cmd.fullName(), cmd.typeId());
						
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@PUT
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final UUID id, final MesureUnitEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnit mesureUnit = company().mesureUnits().get(cmd.id());						
						mesureUnit.update(cmd.shortName(), cmd.fullName(), cmd.typeId());
						
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@DELETE
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response delete(@PathParam("id") final UUID id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						MesureUnit mesureUnit = company().mesureUnits().get(id);
						company().mesureUnits().delete(mesureUnit);
						
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
