<%@ taglib uri="http://jawr.net/tags-el" prefix="jwr" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" import="java.util.*" %> 
<%@ page import = "java.util.ResourceBundle" %>
<% ResourceBundle resource = ResourceBundle.getBundle("settings");
  String version=resource.getString("version");
  String mode = resource.getString("mode");  
  
  ResourceBundle resourceConfig = ResourceBundle.getBundle(mode + "_config");
  String linkRoot = resourceConfig.getString("linkRoot");
  String modeText = resourceConfig.getString("modeText"); %>
 
<html ng-app="lightpro">
	<head>
		<base href="/<%=linkRoot %>/spa/">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>LightPro {{modeText}}</title>
		<link id="linkRoot" href="/<%=linkRoot %>" />
		
		<jwr:style src="/style.min.css" />
		<jwr:script src="/vendors.min.js" />
    	<jwr:script src="/app.min.js" />
    	
    	<script type="text/javascript">
        	var appVersion = '<%=version %>';
        	var modeText = '<%=modeText %>';
    	</script>
	</head>
	<body>
		<div ui-view></div>	
	</body>
</html>