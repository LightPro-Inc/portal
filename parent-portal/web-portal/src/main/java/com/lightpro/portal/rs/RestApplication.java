/**
 * 
 */
package com.lightpro.portal.rs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import com.lightpro.admin.rs.CompanyRs;
import com.lightpro.admin.rs.MembershipRs;
import com.lightpro.admin.rs.MesureUnitRs;
import com.lightpro.admin.rs.PersonRs;
import com.lightpro.admin.rs.SequenceRs;
import com.lightpro.admin.rs.TaxRs;
import com.lightpro.hotel.rs.BookingRs;
import com.lightpro.hotel.rs.GuestRs;
import com.lightpro.hotel.rs.MaidRs;
import com.lightpro.hotel.rs.RoomCategoryRs;
import com.lightpro.hotel.rs.RoomRs;
import com.lightpro.sales.rs.CustomerRs;
import com.lightpro.sales.rs.ProductRs;
import com.lightpro.sales.rs.QuotationRs;
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
		JavaTimeModule javaTimeModule = new JavaTimeModule();
		// Hack time module to allow 'Z' at the end of string (i.e. javascript json's) 
		javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
		javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
		mapper.registerModule(javaTimeModule);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
		mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
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
		register(PersonRs.class);
		
		// 2 - hotel
		register(RoomCategoryRs.class);		
		register(RoomRs.class);		
		register(BookingRs.class);	
		register(GuestRs.class);	
		register(MaidRs.class);	
		
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
		
		// 4 - ventes		
		register(ProductRs.class);
		register(QuotationRs.class);
		register(CustomerRs.class);
		
		// register features
		register(JacksonFeature.class);		
	}
}
