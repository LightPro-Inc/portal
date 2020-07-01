package com.infrastructure.pgsql;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.sql.DataSource;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.core.HorodateMetadata;
import com.infrastructure.datasource.Base;
import com.infrastructure.datasource.DomainsStore;
import com.infrastructure.datasource.QueryBuilder;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public final class PgBase implements Base {
	
	private transient Connection conn;
	private final transient UUID author;
	private final transient UUID companyId;
	
	//private static transient int numberOfConnections;
	private static transient DataSource ds;

	static {
		//numberOfConnections = 0;
		InputStream inputStreamSettings = null;
		InputStream inputStreamConfig = null;
		
		Properties settings = new Properties();
		String settingsFileName = "settings.properties";
		
		inputStreamSettings = PgBase.class.getClassLoader().getResourceAsStream(settingsFileName);    			
		
		try {
			if(inputStreamSettings == null)
				throw new FileNotFoundException(String.format("Settings file '%s' not found !", settingsFileName));
			
			settings.load(inputStreamSettings);			
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		
		Properties config = new Properties();
		String configFileName = settings.getProperty("mode") + "_config.properties";
    	inputStreamConfig = PgBase.class.getClassLoader().getResourceAsStream(configFileName);
		
    	try {
			if(inputStreamConfig == null)
				throw new FileNotFoundException(String.format("Config file '%s' not found !", settingsFileName));
			
			config.load(inputStreamConfig);			
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
    	
    	String url;
    	String username;
    	String password;
    	String driver;
    	String cachePrepStmts;
    	String prepStmtCacheSize;
    	String prepStmtCacheSqlLimit;
    	int maximumPoolSize;
    	long connectionTimeout;
    	long maxLifetime;
    	
		try {
			url = config.getProperty("url");
			username = config.getProperty("username");
			password = config.getProperty("password");
			driver = config.getProperty("driver");
			cachePrepStmts = config.getProperty("cachePrepStmts");
			prepStmtCacheSize = config.getProperty("prepStmtCacheSize");
			prepStmtCacheSqlLimit = config.getProperty("prepStmtCacheSqlLimit");
			maximumPoolSize = Integer.parseInt(config.getProperty("maximumPoolSize"));
			connectionTimeout = Long.parseLong(config.getProperty("connectionTimeout"));
			maxLifetime = Long.parseLong(config.getProperty("maxLifetime"));    			                              
		} finally {
			
			if(inputStreamSettings != null)
			{
				try {
					inputStreamSettings.close();
				} catch (IOException e) { }
			}
			
			if(inputStreamConfig != null)
			{
				try {
					inputStreamConfig.close();
				} catch (IOException e) { }
			}
		}
		
		HikariConfig configDb = new HikariConfig();
		configDb.setJdbcUrl(url);
		configDb.setUsername(username);
		configDb.setPassword(password);
		configDb.setDriverClassName(driver);
		configDb.addDataSourceProperty("cachePrepStmts", cachePrepStmts);
		configDb.addDataSourceProperty("prepStmtCacheSize", prepStmtCacheSize);
		configDb.addDataSourceProperty("prepStmtCacheSqlLimit", prepStmtCacheSqlLimit);
		configDb.setMaximumPoolSize(maximumPoolSize);
		configDb.setConnectionTimeout(connectionTimeout);
		configDb.setMaxLifetime(maxLifetime);

        ds = new HikariDataSource(configDb);
	}
	
	private PgBase() {
        this(null, null);
    }
	
	private PgBase(final UUID author, final UUID companyId) {
        this.author = author;
        this.companyId = companyId;
    }
	
	public UUID authorId(){
		return author;
	}
	
	public UUID companyId(){
		return companyId;
	}

	@Override
	public List<Object> executeQuery(String query, List<Object> params) throws IOException {
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		List<Object> values = new ArrayList<Object>();
		
		boolean isInTransaction = this.conn != null;
		Connection conn = null;
		
		try {		
			conn = connection(isInTransaction);
			pstmt = conn.prepareStatement(query);
			
			for (int i = 0; i < params.size(); i++) {
				pstmt.setObject(i+1, params.get(i));
			}
						
            rs = pstmt.executeQuery();    
            
            while(rs.next()){
            	ResultSetMetaData metadata = rs.getMetaData();
            	
            	for (int i = 1; i <= metadata.getColumnCount(); i++) {
            		values.add(rs.getObject(i));
				}            	
            }                                             
        } catch (final SQLException ex) {
            throw new IOException(ex);
        } finally{
        	terminate(rs);
        	terminate(pstmt);
        	
        	if(!isInTransaction)
        		terminate(conn);
        }
		
		return values;	
	}
	
	private static void terminate(ResultSet rs) {
		if(rs != null){
    		try {
				rs.close();
			} catch (SQLException ignore) {}
    	}
	}
	
	private static void terminate(PreparedStatement pstmt) {
    	if(pstmt != null){
    		try {
				pstmt.close();
			} catch (SQLException ignore) { }
    	}
	}
	
	public boolean keyExists(String key, String entityName) {
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		boolean exists = false;
		
		try {		
		    conn = connection(false);
			pstmt = conn.prepareStatement(String.format("SELECT %s FROM %s", key, entityName));					
            rs = pstmt.executeQuery();    
            exists = true;
        } catch (final SQLException ex) { } 
		finally{
        	terminate(rs);
        	terminate(pstmt);
            terminate(conn);           
        }
		
		return exists;
	}

	@Override
	public void executeUpdate(String query, List<Object> params) throws IOException {
		
		PreparedStatement pstmt = null;
		
        try {     
        	pstmt = connection(true).prepareStatement(query);
        	
        	for (int i = 0; i < params.size(); i++) {
				pstmt.setObject(i+1, params.get(i));
			}
        	
        	pstmt.executeUpdate();       	            
        } catch (final SQLException ex) {
            throw new IOException(ex);
        }finally{
        	terminate(pstmt);
        }
	}

	@Override
	public DomainsStore domainsStore(DomainMetadata dm) {
		return new PgDomainsStore(this, dm);
	}

	@Override
	public void commit() {
		if(conn == null)
			return;
		
		try {
			conn.commit();							
		} catch (SQLException e) {}
	}

	@Override
	public void rollback() {
		if(conn == null)
			return;
		
		try {
			conn.rollback();
		} catch (SQLException e) {}
	}
	
	private Connection connection(boolean beginTransaction) throws SQLException {
		
		Connection conn = null;
		
		try {
			if(!beginTransaction)
			{
				//numberOfConnections++;
				//System.out.println(numberOfConnections);
				conn = ds.getConnection(); // générer une connection à part -- à fermer directement après utilisation
			}
			else{
				if(this.conn != null)
					conn = this.conn;
				else {
					//numberOfConnections++;
					//System.out.println(numberOfConnections);
					conn = ds.getConnection();
					conn.setAutoCommit(false); 					
					this.conn = conn;
				}
			}
						
		} catch (SQLException e) {
			e.printStackTrace();
			throw new IllegalArgumentException("Le temps de réponse maximum a anormalement été dépassé. Veuillez réssayer dans quelques instants SVP.");
		}
		
		return conn;
	}

	private static void terminate(Connection conn) {
		if(conn == null)
			return;
		
		try {
			if(!conn.getAutoCommit())
				conn.setAutoCommit(true);
			
			conn.close();			
			
			//numberOfConnections--;
			//System.out.println(numberOfConnections);
			
		} catch (SQLException e) { }
	}
	
	@Override
	public void terminate() {	
		terminate(conn);	
		conn = null;
	}

	public static Base getInstance() {
		return new PgBase();
	}
	
	public static Base getInstance(UUID author, UUID companyId) {
		return new PgBase(author, companyId);
	}

	@Override
	public QueryBuilder createQueryBuilder(DomainsStore ds, String statement, List<Object> params, String keyResult, String orderClause) throws IOException {
		return new QueryBuilderImpl(ds, statement, params, keyResult, orderClause);
	}

	@Override
	public QueryBuilder createQueryBuilder(DomainsStore ds, String statement, List<Object> params, String orderClause) throws IOException {
		return createQueryBuilder(ds, statement, params, ds.dm().keyName(), orderClause);
	}

	@Override
	public void deleteAll(DomainMetadata dm) throws IOException {
		
		HorodateMetadata hDm = HorodateMetadata.create();
		
		if(author == null || companyId == null)
			return;
		
		if(!keyExists(hDm.ownerCompanyIdKey(), dm.domainName()))
			return;
		
		String statement;		

		statement = String.format("DELETE FROM %s WHERE %s=?", dm.domainName(), hDm.ownerCompanyIdKey());
		executeUpdate(statement, Arrays.asList(companyId));
	}
}
