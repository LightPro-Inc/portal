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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.core.PaginationSet;
import com.infrastructure.core.UseCode;
import com.lightpro.admin.cmd.ContactPersonEdited;
import com.lightpro.admin.cmd.ContactSocietyEdited;
import com.lightpro.admin.vm.ContactPersonVm;
import com.lightpro.admin.vm.ContactSocietyVm;
import com.lightpro.admin.vm.ContactVm;
import com.lightpro.admin.vm.ListValueVm;
import com.securities.api.Contact;
import com.securities.api.ContactNature;
import com.securities.api.ContactPerson;
import com.securities.api.ContactRole;
import com.securities.api.ContactSociety;
import com.securities.api.Contacts;
import com.securities.api.PersonNaming;
import com.securities.api.Secured;

@Path("/contact")
public class ContactRs extends AdminBaseRs {
	
	private Contacts persons() throws IOException {
		return admin().contacts().of(ContactNature.PERSON);
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
						
						ContactVm item = new ContactVm(admin().contacts().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/person/naming")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getPersonNamings() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(PersonNaming.values()).stream()
														.filter(m -> m.id() > 0)
														.map(m -> new ListValueVm(m.id(), m.toString()))
														.collect(Collectors.toList()); 

						return Response.ok(items).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/society/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSingleSociety(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ContactSocietyVm item = new ContactSocietyVm(admin().contacts().society(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/person/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSinglePerson(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ContactPersonVm item = new ContactPersonVm(admin().contacts().person(id));

						return Response.ok(item).build();
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
						
						Contacts container = admin().contacts().of(UseCode.USER);
						
						List<ContactVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ContactVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ContactVm> pagedSet = new PaginationSet<ContactVm>(itemsVm, page, count);
						
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
						
						Contacts container = persons().of(UseCode.USER).of(ContactRole.NOT_USER);
						
						List<ContactVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ContactVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ContactVm> pagedSet = new PaginationSet<ContactVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@POST
	@Secured
	@Path("/person")
	@Produces({MediaType.APPLICATION_JSON})
	public Response addPerson(final ContactPersonEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Contacts contacts = admin().contacts();
						
						Contact contact = contacts.addPerson(cmd.firstName(), cmd.lastName(), cmd.naming(), cmd.birthDate(), cmd.birthPlace(), cmd.sex(), cmd.posteOccupe(), cmd.photo());
						contact.updateAddresses(cmd.locationAddress(), cmd.phone(), cmd.mobile(), cmd.fax(), cmd.mail(), cmd.poBox(), cmd.webSite());
						
						log.info(String.format("Création du contact personne %s.", contact.name()));
						return Response.ok(new ContactVm(contact)).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Path("/society")
	@Produces({MediaType.APPLICATION_JSON})
	public Response addSociety(final ContactSocietyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Contacts contacts = admin().contacts();
						
						Contact contact = contacts.addSociety(cmd.name());
						contact.updateAddresses(cmd.locationAddress(), cmd.phone(), cmd.mobile(), cmd.fax(), cmd.mail(), cmd.poBox(), cmd.webSite());
						
						log.info(String.format("Création du contact société %s.", contact.name()));
						return Response.ok(new ContactVm(contact)).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/person/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response updatePerson(@PathParam("id") final UUID id, final ContactPersonEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ContactPerson item = admin().contacts().person(id);
						
						item.updatePersonalInfos(cmd.firstName(), cmd.lastName(), cmd.naming(), cmd.birthDate(), cmd.birthPlace(), cmd.sex(), cmd.posteOccupe(), cmd.photo());
						item.updateAddresses(cmd.locationAddress(), cmd.phone(), cmd.mobile(), cmd.fax(), cmd.mail(), cmd.poBox(), cmd.webSite());
						
						ContactSociety society = admin().contacts().buildSociety(cmd.societyId());
						item.changeSociety(society);
						
						log.info(String.format("Mise à jour du contact personne %s.", item.name()));
						return Response.ok(new ContactPersonVm(item)).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/society/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response updateSociety(@PathParam("id") final UUID id, final ContactSocietyEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ContactSociety item = admin().contacts().society(id);
						
						item.updateAdministrativeInfos(cmd.name());
						item.updateAddresses(cmd.locationAddress(), cmd.phone(), cmd.mobile(), cmd.fax(), cmd.mail(), cmd.poBox(), cmd.webSite());
						
						log.info(String.format("Mise à jour du contact société %s.", item.name()));
						return Response.ok(new ContactSocietyVm(item)).build();
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
						
						Contact item = admin().contacts().get(id);
						String name = item.name();
						admin().contacts().delete(item);
						
						log.info(String.format("Suppression du contact %s.", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
