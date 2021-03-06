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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.core.PaginationSet;
import com.lightpro.admin.cmd.SequenceEdited;
import com.lightpro.admin.vm.SequenceVm;
import com.securities.api.Secured;
import com.securities.api.Sequence;
import com.securities.api.Sequences;

@Path("/sequence")
public class SequenceRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAll() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<SequenceVm> items = admin().sequences().all()
														 .stream()
												 		 .map(m -> new SequenceVm(m))
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
						
						Sequences container = admin().sequences();
						
						List<SequenceVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new SequenceVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<SequenceVm> pagedSet = new PaginationSet<SequenceVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
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
						
						SequenceVm item = new SequenceVm(admin().sequences().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(SequenceEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Sequence item = admin().sequences().add(cmd.name(), cmd.prefix(), cmd.suffix(), cmd.size(), cmd.step(), cmd.nextNumber());
						
						log.info(String.format("Cr�ation de la s�quence %s.", item.name()));
						return Response.ok(new SequenceVm(item)).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final UUID id, final SequenceEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Sequence item = admin().sequences().get(id);
						item.update(cmd.name(), cmd.prefix(), cmd.suffix(), cmd.size(), cmd.step(), cmd.nextNumber());
						
						log.info(String.format("Mise � jour de la s�quence %s.", item.name()));
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
						
						Sequence item = admin().sequences().get(id);
						String name = item.name();
						admin().sequences().delete(item);
						
						log.info(String.format("Suppression de la s�quence %s.", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
