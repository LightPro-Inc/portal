package com.infrastructure.pgsql;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.sql.DataSource;

import org.apache.commons.dbutils.DbUtils;

import com.common.utilities.convert.UUIDConvert;
import com.infrastructure.core.DomainMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class PgBase implements Base {
	
	private transient Connection conn;
	private transient UUID author;
	private static transient DataSource origin;

	public PgBase(){
		// default user
		author = UUID.fromString("08cc7ef0-dd5d-4afa-a2f7-b733bd89c985");
	}
	
	private PgBase(UUID author) {
        this.author = author;
    }
	
	public UUID author(){
		return author;
	}
		
	synchronized private static DataSource getDs() throws IOException {

    	if(origin == null){
    		
    		InputStream inputStreamSettings = null;
    		InputStream inputStreamConfig = null;
    		
    		try {
    			Properties settings = new Properties();
    			String settingsFileName = "settings.properties";
    			
    			inputStreamSettings = PgBase.class.getClassLoader().getResourceAsStream(settingsFileName);    			
    			
    			if(inputStreamSettings != null) {
    				settings.load(inputStreamSettings);
    			}else{
    				throw new FileNotFoundException(String.format("Settings file '%s' not found !", settingsFileName));
    			}
    			
    			Properties config = new Properties();
    			String configFileName = settings.getProperty("mode") + "_config.properties";
    	    	inputStreamConfig = PgBase.class.getClassLoader().getResourceAsStream(configFileName);
    			
    	    	if(inputStreamConfig != null) {
    	    		config.load(inputStreamConfig);
    			}else{
    				throw new FileNotFoundException(String.format("Config file '%s' not found !", configFileName));
    			}
    	    	
    			HikariConfig configDb = new HikariConfig();
    			configDb.setJdbcUrl(config.getProperty("url"));
    			configDb.setUsername(config.getProperty("username"));
    			configDb.setPassword(config.getProperty("password"));
    			configDb.setDriverClassName(config.getProperty("driver"));
    			configDb.addDataSourceProperty("cachePrepStmts", config.getProperty("cachePrepStmts"));
    			configDb.addDataSourceProperty("prepStmtCacheSize", config.getProperty("prepStmtCacheSize"));
    			configDb.addDataSourceProperty("prepStmtCacheSqlLimit", config.getProperty("prepStmtCacheSqlLimit"));
    			configDb.setMaximumPoolSize(Integer.parseInt(config.getProperty("maximumPoolSize")));
    			configDb.setConnectionTimeout(Long.parseLong(config.getProperty("connectionTimeout")));
    			configDb.setMaxLifetime(Long.parseLong(config.getProperty("maxLifetime")));

                origin = new HikariDataSource(configDb);                                
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if(inputStreamSettings != null)
					inputStreamSettings.close();
				
				if(inputStreamConfig != null)
					inputStreamConfig.close();
			}
    		
    		return origin;
    	}else
    		return origin;        
    }

	@Override
	public List<Object> executeQuery(String query, List<Object> params) throws IOException {
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		List<Object> values = new ArrayList<Object>();
		
		try {		
			conn = connection();
			pstmt = conn.prepareStatement(query);
			
			for (int i = 0; i < params.size(); i++) {
				pstmt.setObject(i+1, params.get(i));
			}
						
            rs = pstmt.executeQuery();    
            
            while(rs.next()){
            	values.add(rs.getObject(1));
            }                                             
        } catch (final SQLException ex) {
            throw new IOException(ex);
        } finally{
        	DbUtils.closeQuietly(rs);
            DbUtils.closeQuietly(pstmt);
            
            if(!inTransaction())
            	terminate(); 
        }
		
		return values;	
	}
	
	public boolean keyExists(String key, String entityName) throws IOException {
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {		
		    conn = connection();
			pstmt = conn.prepareStatement(String.format("SELECT %s FROM %s", key, entityName));					
            rs = pstmt.executeQuery();    
            return true;
        } catch (final SQLException ex) {
            return false;
        } finally{
        	DbUtils.closeQuietly(rs);
            DbUtils.closeQuietly(pstmt); 
            
            if(!inTransaction())
            	terminate();            
        }
	}
	
	private boolean inTransaction() {
		try {
			return !conn.getAutoCommit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return false;
	}

	@Override
	public void executeUpdate(String query, List<Object> params) throws IOException {
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		
        try {     
        	conn = connection();
        	pstmt = conn.prepareStatement(query);
        	
        	for (int i = 0; i < params.size(); i++) {
				pstmt.setObject(i+1, params.get(i));
			}
        	
        	pstmt.executeUpdate();       	            
        } catch (final SQLException ex) {
            throw new IOException(ex);
        }finally{
        	DbUtils.closeQuietly(pstmt);
        	
        	if(!inTransaction())
        		terminate(); 
        }
	}

	@Override
	public DomainsStore domainsStore(DomainMetadata dm) {
		return new PgDomainsStore(this, dm);
	}

	@Override
	public void beginTransaction() throws IOException {
		try {
			connection().setAutoCommit(false);
		} catch (SQLException e) {
			throw new IOException(e);
		}		
	}

	@Override
	public void commit() throws IOException {
		try {
			conn.commit();	
			conn.setAutoCommit(true);			
		} catch (SQLException e) {								
			throw new IOException(e);
		}
	}

	@Override
	public void rollback() throws IOException {
		try {
			conn.rollback();

		} catch (SQLException e) {						
			throw new IOException(e);
		}
	}
	
	synchronized private Connection connection() throws IOException {
		try {
			if(conn == null)
				conn = getDs().getConnection();
			
			return conn;
		} catch (SQLException e) {
			throw new IOException(e);
		}
	}

	@Override
	public void terminate() throws IOException {		
		DbUtils.closeQuietly(conn);
		conn = null;
	}

	@Override
	public Base build(String username) throws IOException {
		String statement = String.format("SELECT id FROM users WHERE username=?");
		List<Object> values = executeQuery(statement, Arrays.asList(username));
		
		if(values.isEmpty())
			throw new IllegalArgumentException("User not found !");
		
		return new PgBase(UUIDConvert.fromObject(values.get(0)));
	}
}
