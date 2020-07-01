package com.lightpro.admin.rs;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.lightpro.admin.vm.DayVm;
import com.lightpro.admin.vm.MonthVm;
import com.securities.api.Indicator;
import com.securities.api.Indicators;
import com.securities.api.Secured;

@Path("/dashboard-tool")
public class DashboardToolsRs extends AdminBaseRs {	
	
	@GET
	@Secured
	@Path("/year/{year}/month/{month}/day")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getDays(@PathParam("year") final int year, @PathParam("month") final int month) throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {											 
						 
						 List<DayVm> days = new ArrayList<DayVm>();
						 days.add(new DayVm("Tous les jours", 0, month, year));
						 
						 if(month > 0){
							 int daysInMonth = LocalDate.of(year, month, 1).lengthOfMonth();
							 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE d");
							 
							 for (int i = 1; i <= daysInMonth; i++) {
								LocalDate day = LocalDate.of(year, month, i);
								
								String name = day.format(formatter);
								int number = day.getDayOfMonth();
								
								days.add(new DayVm(name, number, month, year));
							}
						 }						 						 						 

						return Response.ok(days).build();
					}
				});			
	}	
	
	@GET
	@Secured
	@Path("/month")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getMonths() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						 List<MonthVm> months = Arrays.asList(
								 	new MonthVm("Tous les mois", 0),
								 	new MonthVm("Janvier"      , 1),
								 	new MonthVm("Février"      , 2),
								 	new MonthVm("Mars"         , 3),
								 	new MonthVm("Avril"        , 4),
								 	new MonthVm("Mai"          , 5),
								 	new MonthVm("Juin"         , 6),
								 	new MonthVm("Juillet"      , 7),
								 	new MonthVm("Août"         , 8),
								 	new MonthVm("Septembre"    , 9),
								 	new MonthVm("Octobre"      , 10),
								 	new MonthVm("Novembre"     , 11),
								 	new MonthVm("Décembre"     , 12)
								 );

						return Response.ok(months).build();
					}
				});			
	}	
	
	@GET
	@Secured
	@Path("/year/work")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getYearsWork() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						List<Integer> years = new ArrayList<Integer>();
						for (Integer year = 2015; year <= LocalDate.now().getYear(); year++) {
							years.add(year);
						}
						
						return Response.ok(years).build();
					}
				});			
	}
	
	@GET
	@Secured
	@Path("/day/today")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getToday() throws IOException {	
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						LocalDate now = LocalDate.now();
						DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE d");
						String name = now.format(formatter);
						
						return Response.ok(new DayVm(name, now.getDayOfMonth(), now.getMonthValue(), now.getYear())).build();
					}
				});			
	}
	
	@POST
	@Path("/indicator/{id}")
	@Secured
	@Produces({MediaType.APPLICATION_JSON})
	public Response addIndicator(@PathParam("id") final int id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Indicators indicators = currentCompany.indicators();
						Indicator item = indicators.get(id);
						currentUser.indicators().add(item);
						
						log.info(String.format("Ajout de l'indicateur %s au tableau de bord général de l'utilisateur %s", item.name(), currentUser.name()));
						return Response.status(Response.Status.OK).build();
					}
				});		
	}
	
	@DELETE
	@Secured
	@Path("/indicator/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response deleteIndicator(@PathParam("id") final int id) throws IOException {
		
		return createHttpResponse(
				new Callable<Response>(){
					@Override
					public Response call() throws IOException {
						
						Indicators indicators = currentCompany.indicators();
						Indicator item = indicators.get(id);
						currentUser.indicators().delete(item);
						
						log.info(String.format("Retrait de l'indicateur %s au tableau de bord général de l'utilisateur %s", item.name(), currentUser.name()));
						return Response.status(Response.Status.OK).build();
					}
				});	
	}
}
