
package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

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
import com.lightpro.admin.cmd.Credentials;
import com.lightpro.admin.cmd.LockAccount;
import com.lightpro.admin.cmd.NewPassword;
import com.lightpro.admin.cmd.UserEdited;
import com.lightpro.admin.vm.MembershipContextVm;
import com.lightpro.admin.vm.UserVm;
import com.securities.api.MembershipContext;
import com.securities.api.Person;
import com.securities.api.Persons;
import com.securities.api.Profile;
import com.securities.api.Secured;
import com.securities.api.User;

/**
 * @author oob
 *
 */
@Path("/membership")
public class MembershipRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Path("/user/current")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getCurrentUser() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.ok(new UserVm(currentUser(), true)).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/user/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getUser(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						User user = membership().get(id);
						return Response.ok(new UserVm(user)).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/user/search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response search( @QueryParam("page") int page, 
							@QueryParam("pageSize") int pageSize, 
							@QueryParam("filter") String filter) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						User currenUser = currentUser();
						List<UserVm> itemsVm = membership().find(page, pageSize, filter).stream()
															 .map(m -> new UserVm(m, m.isEqual(currenUser)))
															 .collect(Collectors.toList());
													
						int count = membership().totalCount(filter);
						PaginationSet<UserVm> pagedSet = new PaginationSet<UserVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@POST
	@Secured
	@Path("/register")
	@Produces({MediaType.APPLICATION_JSON})
	public Response register(final UserEdited newUser) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = currentCompany().profiles().get(newUser.profileId());
						Persons personNotUsers = currentCompany().personNotUsers();
						Person person = personNotUsers.build(newUser.id());
						
						User user;
						
						if(personNotUsers.contains(person))
						{
							// save persons info
							person.update(newUser.firstName(), 
									newUser.lastName(), 
									newUser.sex(), 
									newUser.address(), 
									newUser.birthDate(), 
									newUser.tel1(), 
									newUser.tel2(), 
									newUser.email(), 
									newUser.photo());
							
							// register as user
							user = membership().register(person, newUser.username(), profile);							
						}else {
							// new person register as user
							user = membership().register(newUser.firstName(), 
									newUser.lastName(), 
									newUser.sex(),
									newUser.address(), 
									newUser.birthDate(), 
									newUser.tel1(), 
									newUser.tel2(), 
									newUser.email(), 
									newUser.photo(), 
									newUser.username(),
									profile);
						}						
						
						return Response.ok(new UserVm(user)).build();
					}
				});			
	}	
	
	@POST
	@Secured
	@Path("/change-password")
	@Produces({MediaType.APPLICATION_JSON})
	public Response changePassword(final NewPassword newPassword) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						membership().changePasswordByFullUsername(newPassword.fullUsername(), newPassword.newPassword(), newPassword.oldPassword());
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}	
	
	@POST
	@Secured
	@Path("/user/{id}/init-password")
	@Produces({MediaType.APPLICATION_JSON})
	public Response initPassword(@PathParam("id") final UUID id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						User user = membership().get(id);
						membership().initPassword(user);
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}	
	
	@POST
	@Secured
	@Path("/user/{id}/lock")
	@Produces({MediaType.APPLICATION_JSON})
	public Response initPassword(@PathParam("id") final UUID id, LockAccount cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						User user = membership().get(id);
						membership().lock(user, cmd.isLocked());
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}	
	
	@PUT
	@Secured
	@Path("/user/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response updateUser(@PathParam("id") final UUID id, final UserEdited userToUpdate) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = currentCompany().profiles().get(userToUpdate.profileId());
						
						User user = membership().get(id);
						user.update(userToUpdate.firstName(), 
									userToUpdate.lastName(), 
									userToUpdate.sex(),
									userToUpdate.address(), 
									userToUpdate.birthDate(), 
									userToUpdate.tel1(), 
									userToUpdate.tel2(), 
									userToUpdate.email(), 
									userToUpdate.photo());
						
						user.changeProfile(profile);
						
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
	
	@POST
	@Path("authenticate")
	@Produces({MediaType.APPLICATION_JSON})
	public Response logon(final Credentials credentials)  throws IOException {

		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
												
						String fullUsername = credentials.fullUsername();
						String password = credentials.password();
						
						MembershipContext memberContext = null;
						
						if(hasValidCompany(fullUsername))
							memberContext = membership(fullUsername).validateUser(getUsername(fullUsername), password);
						
						if(memberContext == null)
							throw new IllegalArgumentException("Pseudo ou mot de passe invalide !");
												
						return Response.ok(new MembershipContextVm(memberContext))
									   .build();
					}
				});			
	}
	
	@POST
	@Secured
	@Path("{username}/logout")
	@Produces({MediaType.APPLICATION_JSON})
	public Response logout(@PathParam("username") final String username)  throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.noContent().build();
					}
				});			
	}
}
