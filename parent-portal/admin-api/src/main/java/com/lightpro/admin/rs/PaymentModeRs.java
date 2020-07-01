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

import com.lightpro.admin.cmd.PaymentModeEdited;
import com.lightpro.admin.vm.ListValueVm;
import com.lightpro.admin.vm.PaymentModeVm;
import com.securities.api.PaymentMode;
import com.securities.api.PaymentModeType;
import com.securities.api.Secured;

@Path("/payment-mode")
public class PaymentModeRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAll() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<PaymentModeVm> items = admin().paymentModes().all()
													 .stream()
											 		 .map(m -> new PaymentModeVm(m))
											 		 .collect(Collectors.toList());

						return Response.ok(items).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/type")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getTypes() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<ListValueVm> items = Arrays.asList(PaymentModeType.values())
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
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getSingle(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						PaymentModeVm item = new PaymentModeVm(admin().paymentModes().get(id));

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response add(PaymentModeEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						admin().paymentModes().add(cmd.name(), cmd.type());
						
						log.info(String.format("Création du mode de paiement %s", cmd.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Path("/{id}/enable")
	@Produces({MediaType.APPLICATION_JSON})
	public Response enable(@PathParam("id") final UUID id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						PaymentMode paymentMode = admin().paymentModes().get(id);
						paymentMode.enable(true);
						
						log.info(String.format("Activation du mode de paiement %s.", paymentMode.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Path("/{id}/disable")
	@Produces({MediaType.APPLICATION_JSON})
	public Response disable(@PathParam("id") final UUID id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						PaymentMode paymentMode = admin().paymentModes().get(id);
						paymentMode.enable(false);
						
						log.info(String.format("Désactivation du mode de paiement %s.", paymentMode.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@PUT
	@Secured
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response update(@PathParam("id") final UUID id, final PaymentModeEdited cmd) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						PaymentMode item = admin().paymentModes().get(id);
						item.update(cmd.name());
						
						log.info(String.format("Mise à jour du mode de paiement %s.", item.name()));
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
						
						PaymentMode item = admin().paymentModes().get(id);
						String name = item.name();
						admin().paymentModes().delete(item);
						
						log.info(String.format("Suppression du mode de paiement %s.", name));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
