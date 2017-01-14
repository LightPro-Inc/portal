
package com.lightpro.admin.rs;

import java.io.IOException;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.cmd.Credentials;
import com.lightpro.admin.cmd.NewUser;
import com.lightpro.admin.vm.MembershipContextVm;
import com.securities.api.MembershipContext;

/**
 * @author oob
 *
 */
@Path("/membership")
public class MembershipRs extends AdminBaseRs {
	
	@POST
	@Path("/register")
	@Produces({MediaType.APPLICATION_JSON})
	public Response register(final NewUser newUser) throws IOException {
		
		company().membership().register(newUser.firstName(), 
				    		newUser.lastName(), 
				    		newUser.username(), 
				    		newUser.password());
		
		return Response.status(Response.Status.CREATED).build();
	}	
	
	@POST
	@Path("authenticate")
	@Produces({MediaType.APPLICATION_JSON})
	public Response logon(final Credentials credentials)  throws IOException {

		MembershipContext memberContext = company().membership().validateUser(credentials.username(), 
																  credentials.password());
		
		return Response.ok(new MembershipContextVm(memberContext))
					   .build();
	}
	
	@POST
	@Path("{username}/logout")
	@Produces({MediaType.APPLICATION_JSON})
	public Response logout(@PathParam("username") final String username)  throws IOException {
		
		return Response.noContent().build();
	}
}
