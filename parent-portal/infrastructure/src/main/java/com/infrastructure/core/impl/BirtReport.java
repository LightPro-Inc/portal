package com.infrastructure.core.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.EXCELRenderOption;
import org.eclipse.birt.report.engine.api.EngineConfig;
import org.eclipse.birt.report.engine.api.EngineConstants;
import org.eclipse.birt.report.engine.api.IReportEngine;
import org.eclipse.birt.report.engine.api.IReportEngineFactory;
import org.eclipse.birt.report.engine.api.IReportRunnable;
import org.eclipse.birt.report.engine.api.IRunAndRenderTask;
import org.eclipse.birt.report.engine.api.PDFRenderOption;
import org.eclipse.birt.report.engine.api.RenderOption;
import org.eclipse.core.internal.registry.RegistryProviderFactory;

import com.infrastructure.core.Report;

public abstract class BirtReport implements Report {
	
	private transient final String reportName;	
	
	public BirtReport(String reportName) {
		this.reportName = reportName;
	}
	
	@SuppressWarnings("unchecked")
	protected void render(Object moduleContext, String format, OutputStream output, Map<String, Object> parameters) throws IOException {
			
		IReportEngine engine = null;						
		
		try {							
			final EngineConfig config = new EngineConfig();
			
			Platform.startup(config);
			final IReportEngineFactory factory = (IReportEngineFactory) Platform.createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
			engine = factory.createReportEngine(config);
						
			String filePath = StringUtils.isBlank(directory()) ? String.format("/%s.rptdesign", reportName) : String.format("%s/%s.rptdesign", directory(), reportName);
			final InputStream reportResource = getClass().getResourceAsStream(filePath);
			IReportRunnable runnable = null;
			
			runnable = engine.openReportDesign(reportResource);
			final IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);
			
			RenderOption pdfOptions;
			
			switch (format) {
				case "XLS":
					pdfOptions = new EXCELRenderOption();
					pdfOptions.setOutputFormat("XLS");
					break;
				case "postscript":
					pdfOptions = new RenderOption();
					pdfOptions.setOutputFormat("postscript");
				default:
					pdfOptions = new PDFRenderOption();
					pdfOptions.setOutputFormat("PDF");
					//pdfOptions.setOption(IPDFRenderOption.PAGE_OVERFLOW, IPDFRenderOption.FI);
			}
			
																
			pdfOptions.setOutputStream(output);
			task.setRenderOption(pdfOptions);
			
			task.getAppContext().put(EngineConstants.APPCONTEXT_CLASSLOADER_KEY, getClass().getClassLoader());
			task.getAppContext().put("moduleContext", moduleContext);
			
			task.setParameterValues(parameters);
			task.validateParameters();
			
			task.run();
			task.close();													
		} catch(Exception ex){
			ex.printStackTrace();
			throw new IOException("Une erreur est survenue lors de la génération du rapport !");
		}finally {
			try
			{
				engine.destroy();
				Platform.shutdown();
				//Bugzilla 351052
				RegistryProviderFactory.releaseDefault();
			}catch ( Exception e1 ){
			    // Ignore
			}
		}
	}
	
	@Override
	public String reportName(){
		return reportName;
	}
	
	@Override
	public ByteArrayOutputStream renderAsByteArray(String format) throws IOException {
		
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		render(format, output);
		
		return output;
	}

	@Override
	public StreamingOutput renderAsStreaming(String format) throws IOException {
		ByteArrayOutputStream byteArrayOutput = renderAsByteArray(format);
		
		StreamingOutput fileStream = new StreamingOutput(){
			@Override
			public void write(OutputStream output) throws IOException {
				try {
					byteArrayOutput.writeTo(output);
				} finally
				{
					byteArrayOutput.close();
				}								
			}
		};
		
		return fileStream;
	}

	@Override
	public ByteArrayOutputStream renderPDFAsByteArray() throws IOException {
		return renderAsByteArray("PDF");
	}

	@Override
	public StreamingOutput renderPDFAsStreaming() throws IOException {
		return renderAsStreaming("PDF"); 
	}
}
