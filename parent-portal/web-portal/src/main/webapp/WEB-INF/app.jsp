<%@ taglib uri="http://jawr.net/tags-el" prefix="jwr" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="lightpro">
	<head>
		<base href="/web/spa/">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>LightPro</title>
		<jwr:style src="/style.min.css" />
		<jwr:script src="/vendors.min.js" />
    	<jwr:script src="/app.min.js" />
    	
    	<script type="text/javascript">
        	var appVersion = '1.0.0.0';
    	</script>
	</head>
	<body>
		<div ui-view></div>	
	</body>
</html>