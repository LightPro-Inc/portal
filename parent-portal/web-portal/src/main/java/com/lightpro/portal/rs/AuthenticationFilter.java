package com.lightpro.portal.rs;

import java.io.IOException;
import java.security.Principal;

import javax.annotation.Priority;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;

import com.infrastructure.pgsql.PgBase;
import com.securities.api.Membership;
import com.securities.api.Secured;
import com.securities.api.User;
import com.securities.impl.EncryptionImpl;
import com.securities.impl.MembershipImpl;

import io.jsonwebtoken.Claims;
import net.jawr.web.util.StringUtils;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		
		// Get the HTTP Authorization header from the request
        String authorizationHeader = 
            requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        
        // Check if the HTTP Authorization header is present and formatted correctly 
        if (StringUtils.isEmpty(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
            throw new NotAuthorizedException("Authorization header must be provided");
        }
        
        // Extract the token from the HTTP Authorization header
        String token = authorizationHeader.substring("Bearer".length()).trim();

        try {
        	
            // Validate the token
            validateToken(requestContext, token);

        } catch (Exception e) {
        	e.printStackTrace();
            requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED).build());
        }
	}
	
	private void validateToken(ContainerRequestContext requestContext, String token) throws Exception {
						
		Claims claims = new EncryptionImpl().claims(token);
		String username = claims.get("username", String.class);
		String hashedPassword = claims.get("password", String.class);
		
		Membership membership = new MembershipImpl(new PgBase());
		User user = membership.get(username);
		
		if(!user.hashedPassword().equals(hashedPassword))
			throw new Exception("Username or password is invalid !");
		
		requestContext.setSecurityContext(new SecurityContext() {

		    @Override
		    public Principal getUserPrincipal() {

		        return new Principal() {

		            @Override
		            public String getName() {
		            	return username;
		            }
		        };
		    }

		    @Override
		    public boolean isUserInRole(String role) {
		        return true;
		    }

		    @Override
		    public boolean isSecure() {
		        return false;
		    }

		    @Override
		    public String getAuthenticationScheme() {
		        return null;
		    }
		});
    }
}
	