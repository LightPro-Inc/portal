/**
 * 
 */
package com.lightpro.portal.rs;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import com.lightpro.admin.rs.CompanyRs;
import com.lightpro.admin.rs.MembershipRs;
import com.lightpro.admin.rs.MesureUnitRs;
import com.lightpro.admin.rs.SequenceRs;
import com.lightpro.admin.rs.TaxRs;
import com.lightpro.hotel.rs.BookingRs;
import com.lightpro.hotel.rs.GuestRs;
import com.lightpro.hotel.rs.PersonRs;
import com.lightpro.hotel.rs.RoomCategoryRs;
import com.lightpro.hotel.rs.RoomRs;
import com.lightpro.stocks.rs.ArticleCategoryRs;
import com.lightpro.stocks.rs.ArticleFamilyRs;
import com.lightpro.stocks.rs.ArticleRs;
import com.lightpro.stocks.rs.LocationRs;
import com.lightpro.stocks.rs.OperationCategoryRs;
import com.lightpro.stocks.rs.OperationRs;
import com.lightpro.stocks.rs.OperationTypeRs;
import com.lightpro.stocks.rs.StockMovementRs;
import com.lightpro.stocks.rs.WarehouseRs;

/**
 * @author oob
 *
 */
public class RestApplication extends ResourceConfig {
	public RestApplication(){		
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
		
		JacksonJaxbJsonProvider provider = new JacksonJaxbJsonProvider();
        provider.setMapper(mapper);
        
        register(provider);
	
		// register application resources
        // 1 - admin
		register(MembershipRs.class);
		register(CompanyRs.class);
		register(SequenceRs.class);
		register(MesureUnitRs.class);
		register(TaxRs.class);
		
		// 2 - hotel
		register(RoomCategoryRs.class);		
		register(RoomRs.class);		
		register(BookingRs.class);	
		register(GuestRs.class);	
		register(PersonRs.class);	
		
		// 3 - stocks		
		register(ArticleFamilyRs.class);
		register(ArticleCategoryRs.class);
		register(ArticleRs.class);
		register(WarehouseRs.class);
		register(OperationTypeRs.class);
		register(LocationRs.class);
		register(OperationCategoryRs.class);
		register(OperationRs.class);
		register(StockMovementRs.class);
		
		// register features
		register(JacksonFeature.class);		
	}
}
