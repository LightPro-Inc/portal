package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.vm.FeatureVm;
import com.securities.api.Feature;
import com.securities.api.FeatureType;
import com.securities.api.Module;
import com.securities.api.Secured;

@Path("/module/{moduleTypeId}/feature")
public class MyFeatureRs extends AdminBaseRs {
	
	private transient Integer moduleTypeId;
	
	@PathParam("moduleTypeId")
	public void setModuleId(final Integer moduleTypeId) throws IOException {
		this.moduleTypeId = moduleTypeId;
	}
	
	private Module module() throws IOException {
		return currentCompany.modulesSubscribed().get(moduleTypeId);
	}
	
	@GET
	@Secured
	@Path("/category/subscribed")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getCategoriesSubscribed() throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<FeatureVm> itemsVm = module().featuresSubscribed().of(FeatureType.FEATURE_CATEGORY).all()
										.stream()
								 		.map(m -> new FeatureVm(m))
								 		.collect(Collectors.toList());

						return Response.ok(itemsVm).build();					
					}
				});		
	}
	
	@GET
	@Secured
	@Path("/category/{id}/child/subscribed")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getChildrenOfCategorySubscribed(@PathParam("id") final String id) throws IOException {		
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Feature item = module().featuresSubscribed().get(id);
						
						List<FeatureVm> itemsVm = item.children()
								  .stream()
						 		  .map(m -> new FeatureVm(m))
						 		  .collect(Collectors.toList());

						return Response.ok(itemsVm).build();					
					}
				});		
	}
}
