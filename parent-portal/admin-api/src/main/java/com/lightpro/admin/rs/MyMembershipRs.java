
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
import com.infrastructure.core.UseCode;
import com.lightpro.admin.cmd.Credentials;
import com.lightpro.admin.cmd.LockAccount;
import com.lightpro.admin.cmd.NewPassword;
import com.lightpro.admin.cmd.UserRegistration;
import com.lightpro.admin.vm.FeatureVm;
import com.lightpro.admin.vm.MembershipContextVm;
import com.lightpro.admin.vm.UserVm;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.ContactPerson;
import com.securities.api.Log;
import com.securities.api.Membership;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.Profile;
import com.securities.api.Secured;
import com.securities.api.User;

/**
 * @author oob
 *
 */
@Path("/membership")
public final class MyMembershipRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Path("/user/current")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getCurrentUser() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						return Response.ok(new UserVm(currentUser, true)).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/user/current/module/{moduletypeid}/feature")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getModuleFeaturesOfCurrentUser(@PathParam("moduletypeid") final int moduleTypeId) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						ModuleType type = ModuleType.get(moduleTypeId);
						Module module = currentCompany.modulesSubscribed().of(type).first();
						
						List<FeatureVm> itemsVm = currentUser.profile().featuresSubscribed().of(module).all().stream()
													 .map(m -> new FeatureVm(m))
													 .collect(Collectors.toList());
													
						return Response.ok(itemsVm).build();
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
						
						User user = membership.get(id);
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
						
						User currenUser = currentUser;
						List<UserVm> itemsVm = membership.withUseCode(UseCode.USER).find(page, pageSize, filter).stream()
															 .map(m -> new UserVm(m, m.equals(currenUser)))
															 .collect(Collectors.toList());
													
						long count = membership.count(filter);
						PaginationSet<UserVm> pagedSet = new PaginationSet<UserVm>(itemsVm, page, count);
						
						return Response.ok(pagedSet).build();
					}
				});	
				
	}
	
	@POST
	@Secured
	@Path("/register")
	@Produces({MediaType.APPLICATION_JSON})
	public Response register(final UserRegistration registration) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = admin().profiles().get(registration.profileId());
						ContactPerson person = admin().contacts().person(registration.id());
						
						User user = membership.register(person, registration.username(), profile);								
						
						log.info(String.format("Création de l'utilisateur %s", registration.username()));
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
						
						currentUser.changePassword(newPassword.newPassword(), newPassword.oldPassword());
						
						log.successAudit(String.format("Changement de mot de passe de l'utilisateur %s", currentUser.name()));
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
						
						User user = membership.get(id);
						user.initPassword();
						
						log.successAudit(String.format("Initialisation du mot de passe de l'utilisateur %s", user.username()));
						return Response.status(Response.Status.OK).build();
					}
				});			
	}	
	
	@POST
	@Secured
	@Path("/user/{id}/lock")
	@Produces({MediaType.APPLICATION_JSON})
	public Response lock(@PathParam("id") final UUID id, LockAccount cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						User user = membership.get(id);
						user.lock(cmd.isLocked());
						
						log.successAudit(String.format("Verrouillage du compte de l'utilisateur %s", user.username()));
						return Response.status(Response.Status.OK).build();
					}
				});			
	}	
	
	@PUT
	@Secured
	@Path("/user/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response updateUser(@PathParam("id") final UUID id, final UserRegistration userToUpdate) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = admin().profiles().get(userToUpdate.profileId());
						
						User user = membership.get(id);
						user.changeProfile(profile);
						
						log.info(String.format("Mise à jour des données de l'utilisateur %s", user.username()));
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
						
						if(hasValidCompany(fullUsername))
						{
							Company company = company(fullUsername);
							
							Log log = company.log().ofModule(ModuleType.ADMIN).withIpAddress(remoteAddress);
							
							String username = User.username(fullUsername);	
							Admin admin = company.moduleAdmin();
							Membership membership = admin.membership();
							
							if(!membership.contains(username)){
								log.failureAudit(String.format("Utilisateur introuvable (pseudo : %s)", username));
								throw new IllegalArgumentException("Pseudo ou mot de passe invalide !");
							}
								
							User user = membership.user(username);
							log = log.ofUser(username);
							
							if(user.matchToPassword(password))								
							{
								log.successAudit(String.format("Authentification avec succès"));
								return Response.ok(new MembershipContextVm(user)).build();
							}
							else
								{
									log.failureAudit(String.format("Mot de passe invalide"));
									throw new IllegalArgumentException("Pseudo ou mot de passe invalide !");
								}
						}
						else
							{
								log.failureAudit(String.format("Entreprise invalide pour le pseudo %s", fullUsername));
								throw new IllegalArgumentException("Pseudo ou mot de passe invalide !");																
							}
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
						log.successAudit(String.format("Déconnection de l'utilisateur %s", username));
						return Response.noContent().build();
					}
				});			
	}
}
