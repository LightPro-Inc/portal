package com.lightpro.portal.rs;

import java.io.IOException;
import java.security.Principal;
import java.util.UUID;

import javax.annotation.Priority;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;

import com.infrastructure.datasource.Base;
import com.infrastructure.pgsql.PgBase;
import com.securities.api.Company;
import com.securities.api.Secured;
import com.securities.api.User;
import com.securities.impl.CompaniesImpl;
import com.securities.impl.EncryptionImpl;

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
		String fullUsername = claims.get("fullUsername", String.class);
		String hashedPassword = claims.get("password", String.class);
		UUID companyId = UUID.fromString(claims.get("companyId", String.class));

		Base base = new PgBase();
		Company company = new CompaniesImpl(base).get(companyId);
		User user = company.membership().getByFullUsername(fullUsername);
		
		if(!user.hashedPassword().equals(hashedPassword) || user.isLocked())
			throw new Exception("Authentification requise !");
		
		requestContext.setSecurityContext(new SecurityContext() {

		    @Override
		    public Principal getUserPrincipal() {

		        return new Principal() {

		            @Override
		            public String getName() {
		            	return fullUsername;
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
	