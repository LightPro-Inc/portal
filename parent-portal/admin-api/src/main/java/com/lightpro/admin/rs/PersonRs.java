package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.core.PaginationSet;
import com.lightpro.admin.vm.PersonVm;
import com.securities.api.Persons;
import com.securities.api.Secured;

@Path("/person")
public class PersonRs extends AdminBaseRs {
	
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
						
						Persons container = currentCompany().persons();
						
						List<PersonVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new PersonVm(m))
															 .collect(Collectors.toList());
													
						int count = container.totalCount(filter);
						PaginationSet<PersonVm> pagedSet = new PaginationSet<PersonVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/not-user/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response notUserSearch( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Persons container = currentCompany().personNotUsers();
						
						List<PersonVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new PersonVm(m))
															 .collect(Collectors.toList());
													
						int count = container.totalCount(filter);
						PaginationSet<PersonVm> pagedSet = new PaginationSet<PersonVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@GET
	@Secured
	@Path("/user/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response userSearch( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Persons container = currentCompany().personUsers();
						
						List<PersonVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new PersonVm(m))
															 .collect(Collectors.toList());
													
						int count = container.totalCount(filter);
						PaginationSet<PersonVm> pagedSet = new PaginationSet<PersonVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
}
