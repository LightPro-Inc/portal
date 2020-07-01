package com.lightpro.portal.rs;

import java.io.IOException;
import java.lang.reflect.Method;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.ErrorMessage;
import com.securities.api.App;
import com.securities.api.Log;
import com.securities.api.Secured;
import com.securities.impl.AppImpl;
import com.securities.impl.LogDb;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	@Context
	private HttpServletRequest requestHttp;
	
	@Context
    private ResourceInfo resourceInfo;
	
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		
		Method method = resourceInfo.getResourceMethod();
		if(!method.isAnnotationPresent(Secured.class))
			return;
		
		// Get the HTTP Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);        

        App app = null;
        try {            
        	String token = App.getToken(authorizationHeader);
        	
            // Check if the HTTP Authorization header is present and formatted correctly 
            if (StringUtils.isBlank(token)) {
                throw new NotAuthorizedException("Vous n'êtes autorisé à accéder à ce service !");
            }
            
            // Validate the token                
            app = new AppImpl(token);
    		app.validateAuthentication();
    		
    		app.base().commit();

        } catch (Exception e) {

        	if(app != null)
        	{
        		app.base().rollback();
            	
            	e.printStackTrace();
            	
            	try {
            		Log log = LogDb.getInstance().withIpAddress(requestHttp.getRemoteAddr());
                	log.failureAudit(e.getMessage());
				} catch (Exception ignore) {
					
				}            	
        	}
        	
            requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                		.entity(new ErrorMessage("Accès non autorisé", e.getMessage()))
                		.build());
        } finally {
        	if(app != null)
        		app.base().terminate();
        }
	}
}
	