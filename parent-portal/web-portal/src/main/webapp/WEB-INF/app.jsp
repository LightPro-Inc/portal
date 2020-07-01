<%@ taglib uri="http://jawr.net/tags-el" prefix="jwr" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" import="java.util.*" %> 
<%@ page import = "java.util.ResourceBundle" %>
<% ResourceBundle resource = ResourceBundle.getBundle("settings");
  String version=resource.getString("version");
  String mode = resource.getString("mode");  
  
  ResourceBundle resourceConfig = ResourceBundle.getBundle(mode + "_config");
  String linkRoot = resourceConfig.getString("linkRoot");
  String modeText = resourceConfig.getString("modeText"); 
  String base = linkRoot.equals("ROOT") ? "" : "/" + linkRoot;
  %>
 
<html ng-app="lightpro">
	<head>
		<base href="<%=base %>/spa/">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>LightPro</title>
		
		<jwr:style src="/style.min.css" />
		<jwr:script src="/vendors.min.js" />
    	<jwr:script src="/app.min.js" />
    	
    	<script type="text/javascript">
        	var appVersion = '<%=version %>';
        	var modeText = '<%=modeText %>';
        	var rootUrl = '<%=base %>';
    	</script>
	</head>
	<body ng-controller="appCtrl">
		<!-- WORKSPACE -->
		<div ui-view ng-show="!isInPrintPreviewState"></div>	
		
		<!-- PRINT PREVIEW -->
		<div style="margin-top:-50px" ng-include="'main/print-preview/printPreviewView.html'" ng-show="isInPrintPreviewState"></div>
	</body>
</html>