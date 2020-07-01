package com.securities.api;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.exception.ExceptionUtils;

import javax.ws.rs.core.Response.Status;

import com.infrastructure.core.ErrorMessage;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.Txn;
import com.securities.impl.AppImpl;
import com.securities.impl.CompanyDb;
import com.securities.impl.LightProCompanyDb;
import com.securities.impl.LogDb;

public abstract class BaseRs {
	
	@Context
	private HttpServletRequest requestHttp;
	
	@Context
	private ContainerRequestContext requestContext;
	
	@Context
    private ResourceInfo resourceInfo;
	
	protected Base base;
	protected Log log;
	protected Company currentCompany;	
	protected Module currentModule;	
	protected User currentUser;
	protected Membership membership;
	protected final ModuleType moduleType;
	protected String remoteAddress;
	
	public BaseRs(ModuleType moduleType) {
		this.moduleType = moduleType;				
	}	
	
	private void buildEnvironnement(){
		
		try {
			remoteAddress = requestHttp.getRemoteAddr();
			
			Method method = resourceInfo.getResourceMethod();
			if(method.isAnnotationPresent(Secured.class)){
				// Get the HTTP Authorization header from the request
		        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION); 
		        String token = App.getToken(authorizationHeader);
		        App app = new AppImpl(token);
				this.base = app.base();		
				this.currentCompany = new CompanyDb(base, app.company().id(), remoteAddress, app.currentUser().username());	
				this.membership = currentCompany.moduleAdmin().membership();
				this.currentUser = app.currentUser();
			}else{
				App app = new AppImpl();
				this.base = app.base();
				this.currentCompany = new LightProCompanyDb(base);
				this.membership = currentCompany.moduleAdmin().membership();
				this.currentUser = this.currentCompany.moduleAdmin().membership().defaultUser();
			}
			
			if(!currentCompany.modulesSubscribed().contains(moduleType))
				throw new IllegalArgumentException(String.format("Le module '%s' n'est pas souscrit !", moduleType));
			
			currentModule = currentCompany.modulesSubscribed().get(moduleType);
			if(currentCompany.modulesInstalled().contains(moduleType))
				currentModule = currentCompany.modulesInstalled().get(moduleType);
						
			log = LogDb.getInstance(currentCompany.shortName(), moduleType, currentUser.username()).withIpAddress(remoteAddress);
			
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	protected Response createHttpResponse(Callable<Response> callable){	
			
		Response response;
		
		try
		{
			buildEnvironnement();
			
			response = new Txn(base).call(
					new Callable<Response>(){
						@Override
						public Response call() throws Exception {
							return callable.call();	
						}
					}
				);	
		} 
		catch (Exception ex)
		{
			response = buildException(ex);
		}
				
		return response;
	}
	
	private Response buildException(Exception ex) {
		Response response;
		
		ex.printStackTrace();
		Throwable exRoot = ExceptionUtils.getRootCause(ex) == null ? ex : ExceptionUtils.getRootCause(ex);
		if(exRoot instanceof IllegalArgumentException){
			exRoot.printStackTrace();			
		
			log.warning(exRoot.getMessage());
			
			response = Response.status(Status.BAD_REQUEST)
						       .entity(new ErrorMessage("Informations", exRoot.getMessage()))
						       .build();
		}else{
			exRoot.printStackTrace();
			
			log.error(exRoot.getMessage(), ExceptionUtils.getStackTrace(exRoot));
			
			response = Response.status(Status.INTERNAL_SERVER_ERROR)
							   .entity(new ErrorMessage("Erreur fatale", exRoot.getMessage()))
							   .build();
		}
		
		return response;
	}
}
