package com.lightpro.admin.rs;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.Callable;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.infrastructure.datasource.Base;
import com.infrastructure.pgsql.PgBase;
import com.lightpro.admin.vm.AdminVm;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.Secured;
import com.securities.impl.AdminDb;
import com.securities.impl.CompanyDb;

@Path("/admin/module")
public final class AdminModuleRs extends AdminBaseRs {
	
	@GET
	@Secured
	@Path("/current")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getCurrent(@PathParam("id") UUID id) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						AdminVm item = new AdminVm(admin());

						return Response.ok(item).build();
					}
				});		
	}
	
	@POST
	@Secured
	@Path("/{companyId}/install")
	@Produces({MediaType.APPLICATION_JSON})
	public Response installModule(@PathParam("companyId") final UUID companyId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
																
						Base base = PgBase.getInstance(currentUser.id(), companyId);
						
						try {
											
							Company company = new CompanyDb(base, companyId);
							Module module = company.modulesSubscribed().get(ModuleType.ADMIN);
							Admin admin = admin(module);
							
							admin.install();
							
							base.commit();
						} catch (IllegalArgumentException e) {
							base.rollback();
							throw e;
						} 
						catch (Exception e) {
							base.rollback();
							throw e;
						} finally {
							base.terminate();
						}						
						
						log.info("Installation du module Admin.");
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
	
	@POST
	@Secured
	@Path("/{companyId}/uninstall")
	@Produces({MediaType.APPLICATION_JSON})
	public Response uninstallModule(@PathParam("companyId") final UUID companyId) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
							
						Base base = PgBase.getInstance(currentUser.id(), companyId);
						
						try {
											
							Company company = new CompanyDb(base, companyId);
							Module module = company.modulesInstalled().get(ModuleType.ADMIN);
							Admin admin = new AdminDb(base, module);
							
							admin.uninstall();
							
							base.commit();
						} catch (IllegalArgumentException e) {
							base.rollback();
							throw e;
						} 
						catch (Exception e) {
							base.rollback();
							throw e;
						} finally {
							base.terminate();
						}						
						
						log.info("Désinstallaltion du module Admin.");
						return Response.status(Response.Status.OK).build();
					}
				});			
	}
}
