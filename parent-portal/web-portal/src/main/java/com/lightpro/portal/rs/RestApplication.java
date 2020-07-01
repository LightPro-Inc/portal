/**
 * 
 */
package com.lightpro.portal.rs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.ws.rs.ext.ParamConverterProvider;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import com.lightpro.admin.rs.AdminModuleRs;
import com.lightpro.admin.rs.ContactRs;
import com.lightpro.admin.rs.CurrencyRs;
import com.lightpro.admin.rs.DashboardToolsRs;
import com.lightpro.admin.rs.MyMembershipRs;
import com.lightpro.admin.rs.MesureUnitRs;
import com.lightpro.admin.rs.MyModuleRs;
import com.lightpro.admin.rs.PaymentModeRs;
import com.lightpro.admin.rs.MyCompanyRs;
import com.lightpro.admin.rs.MyFeatureRs;
import com.lightpro.admin.rs.MyLogRs;
import com.lightpro.admin.rs.ProfileRs;
import com.lightpro.admin.rs.SequenceRs;
import com.lightpro.admin.rs.TaxRs;
import com.lightpro.compta.rs.AccountChartRs;
import com.lightpro.compta.rs.AccountRs;
import com.lightpro.compta.rs.ComptaModuleRs;
import com.lightpro.compta.rs.ComptaReportRs;
import com.lightpro.compta.rs.ExerciseRs;
import com.lightpro.compta.rs.InterfacageRs;
import com.lightpro.compta.rs.JournalRs;
import com.lightpro.compta.rs.LineRs;
import com.lightpro.compta.rs.PieceRs;
import com.lightpro.compta.rs.PieceTypeRs;
import com.lightpro.compta.rs.ReconcileRs;
import com.lightpro.compta.rs.TiersRs;
import com.lightpro.hotel.rs.BookingRs;
import com.lightpro.hotel.rs.GuestRs;
import com.lightpro.hotel.rs.HotelModuleRs;
import com.lightpro.hotel.rs.MaidRs;
import com.lightpro.hotel.rs.RoomCategoryRs;
import com.lightpro.hotel.rs.RoomRs;
import com.lightpro.pdv.rs.CashierRs;
import com.lightpro.pdv.rs.PdvCashierRs;
import com.lightpro.pdv.rs.PdvModuleRs;
import com.lightpro.pdv.rs.PdvRs;
import com.lightpro.pdv.rs.SessionRs;
import com.lightpro.purchases.rs.PurchasesModuleRs;
import com.lightpro.saas.rs.CompanyRs;
import com.lightpro.saas.rs.FeatureRs;
import com.lightpro.saas.rs.LogRs;
import com.lightpro.saas.rs.ModuleRs;
import com.lightpro.saas.rs.SaasModuleRs;
import com.lightpro.sales.rs.CustomerRs;
import com.lightpro.sales.rs.InvoiceRs;
import com.lightpro.sales.rs.PaymentRs;
import com.lightpro.sales.rs.ProductCategoryRs;
import com.lightpro.sales.rs.ProductRs;
import com.lightpro.sales.rs.ProvisionRs;
import com.lightpro.sales.rs.PurchaseOrderRs;
import com.lightpro.sales.rs.SalesInterfacageRs;
import com.lightpro.sales.rs.SalesModuleRs;
import com.lightpro.sales.rs.SellerRs;
import com.lightpro.sales.rs.TeamRs;
import com.lightpro.sales.rs.TeamSellerRs;
import com.lightpro.stocks.rs.ArticleCategoryRs;
import com.lightpro.stocks.rs.ArticleFamilyRs;
import com.lightpro.stocks.rs.ArticleRs;
import com.lightpro.stocks.rs.LocationRs;
import com.lightpro.stocks.rs.OperationCategoryRs;
import com.lightpro.stocks.rs.OperationRs;
import com.lightpro.stocks.rs.OperationTypeRs;
import com.lightpro.stocks.rs.StockMovementRs;
import com.lightpro.stocks.rs.StocksModuleRs;
import com.lightpro.stocks.rs.WarehouseRs;

/**
 * @author oob
 *
 */
public class RestApplication extends ResourceConfig {
	
	public RestApplication(){		
		
		register(AuthenticationFilter.class);
		
		ObjectMapper mapper = new ObjectMapper();
		JavaTimeModule javaTimeModule = new JavaTimeModule();
		// Hack time module to allow 'Z' at the end of string (i.e. javascript json's) 
		javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
		javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
		mapper.registerModule(javaTimeModule);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
		mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		JacksonJaxbJsonProvider provider = new JacksonJaxbJsonProvider();
        provider.setMapper(mapper);
       
        register(provider);
        
        ParamConverterProvider paramConvertProvider = new DateParamerterConverterProvider();
        register(paramConvertProvider);
		// register application resources
       
        // 1 - admin
		register(MyMembershipRs.class);
		register(MyCompanyRs.class);
		register(MyModuleRs.class);
		register(MyFeatureRs.class);
		register(MyLogRs.class);
		register(SequenceRs.class);
		register(MesureUnitRs.class);
		register(TaxRs.class);		
		register(ContactRs.class);
		register(DashboardToolsRs.class);
		register(ProfileRs.class);
		register(PaymentModeRs.class);
		register(AdminModuleRs.class);
		register(CurrencyRs.class);
		
		// 2 - hotel
		register(HotelModuleRs.class);
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
		register(StocksModuleRs.class);
		
		// 4 - ventes		
		register(ProductCategoryRs.class);
		register(ProductRs.class);
		register(CustomerRs.class);
		register(PurchaseOrderRs.class);
		register(InvoiceRs.class);
		register(PaymentRs.class);
		register(TeamRs.class);
		register(TeamSellerRs.class);
		register(SellerRs.class);
		register(SalesModuleRs.class);
		register(ProvisionRs.class);
		register(SalesInterfacageRs.class);
		
		// 5 - pdv
		register(PdvRs.class);
		register(SessionRs.class);
		register(PdvCashierRs.class);
		register(CashierRs.class);
		register(PdvModuleRs.class);
		
		// 5 - compta
		register(ComptaModuleRs.class);
		register(ExerciseRs.class);
		register(ComptaReportRs.class);
		register(AccountChartRs.class);
		register(AccountRs.class);
		register(JournalRs.class);
		register(PieceTypeRs.class);
		register(PieceRs.class);
		register(TiersRs.class);
		register(ReconcileRs.class);
		register(LineRs.class);
		register(com.lightpro.compta.rs.OperationRs.class);
		register(InterfacageRs.class);
		
		// 6 - saas
		register(SaasModuleRs.class);
		register(LogRs.class);
		register(CompanyRs.class);
		register(ModuleRs.class);
		register(FeatureRs.class);
		
		// 7 - purchases
		register(PurchasesModuleRs.class);
		
		// register features
		register(JacksonFeature.class);		
	}
}
