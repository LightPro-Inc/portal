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
import com.lightpro.admin.cmd.FeatureProfiling;
import com.lightpro.admin.cmd.ProfileEdited;
import com.lightpro.admin.cmd.SequenceEdited;
import com.lightpro.admin.vm.FeatureVm;
import com.lightpro.admin.vm.ProfileVm;
import com.securities.api.Feature;
import com.securities.api.FeatureType;
import com.securities.api.Features;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.Profile;
import com.securities.api.Profiles;
import com.securities.api.Secured;

@Path("/profile")
public class ProfileRs extends AdminBaseRs {
	
	private Profiles profiles() throws IOException{
		return admin().profiles();
	}
	
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAll() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ProfileVm> items = profiles().all()
														 .stream()
												 		 .map(m -> new ProfileVm(m))
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
						
						Profiles container = profiles();
						
						List<ProfileVm> itemsVm = container.find(page, pageSize, filter).stream()
															 .map(m -> new ProfileVm(m))
															 .collect(Collectors.toList());
													
						long count = container.count(filter);
						PaginationSet<ProfileVm> pagedSet = new PaginationSet<ProfileVm>(itemsVm, page, count);
						
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
						
						ProfileVm item = new ProfileVm(profiles().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/{id}/module/{moduleTypeId}/feature/category")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getFeatureCategoriesOfModule(@PathParam("id") final UUID id, @PathParam("moduleTypeId") final Integer moduleTypeId) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = profiles().get(id);
						Module module = currentCompany.modulesSubscribed().get(moduleTypeId);
						
						List<FeatureVm> itemsVm = profile.featuresSubscribed().of(module).of(FeatureType.FEATURE_CATEGORY).all()
														 .stream()
														 .map(m -> new FeatureVm(m))
														 .collect(Collectors.toList());
													
						return Response.ok(itemsVm).build();
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/{id}/module/{moduleTypeId}/feature/category/{categoryid}/child")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getFeatureChildrenOfModule(@PathParam("id") final UUID id, @PathParam("moduleTypeId") final Integer moduleTypeId, @PathParam("categoryid") final String categoryId) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = profiles().get(id);
						Feature feature = profile.featuresSubscribed().of(ModuleType.get(moduleTypeId)).get(categoryId);
						
						List<FeatureVm> itemsVm = feature.children()
														 .stream()
														 .map(m -> new FeatureVm(m))
														 .collect(Collectors.toList());
													
						return Response.ok(itemsVm).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Path("/{id}/module/{moduleTypeId}/feature")
	@Produces({MediaType.APPLICATION_JSON})
	public Response profileModuleFeatures(@PathParam("id") final UUID id, @PathParam("moduleTypeId") final Integer moduleTypeId, final FeatureProfiling profiling) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = profiles().get(id);
						Module module = currentCompany.modulesSubscribed().get(moduleTypeId);
						Features featuresSubscribed = module.featuresSubscribed();
						Features profileFeatures = profile.featuresSubscribed().of(module);
						
						for (String id : profiling.featuresToAdd()) {
							Feature item = featuresSubscribed.get(id);
							
							if(!profileFeatures.contains(item))
								profile.addFeature(item);							
						}
						
						for (String id : profiling.featuresToDelete()) {
							Feature item = featuresSubscribed.build(id);							
							profile.removeFeature(item);							
						}
						
						return Response.status(Response.Status.OK).build();	
					}
				});					
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(ProfileEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Profile profile = profiles().add(cmd.name());
						
						log.info(String.format("Création du profil %s.", profile.name()));
						return Response.status(Response.Status.OK).build();
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
						
						Profile item = profiles().get(id);
						item.update(cmd.name());
						
						log.info(String.format("Mise à jour du profil %s.", item.name()));
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
						
						Profile item = profiles().get(id);
						String name = item.name();
						profiles().delete(item);
						
						log.info(String.format("Suppression du profil %s.", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
