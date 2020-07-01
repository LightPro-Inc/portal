(function(app){
	'use strict';
	
	app.filter('cut', cut);

    cut.$inject = []; 
    function cut(value, max, tail) {
    	
        if(!value)
        	return '';
        
        max = parseInt(max, 10);
        if(!max) return value;
        if(value.length <= max) return value;
        
        value = value.substr(0, max);
        var lastspace = vlaue.lastIndexOf(' ');
        if(lastspace !== -1) {
        	if(value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ','){
        		lastspace = lastspace - 1;
        	}
        	
        	value = value.substr(0, lastspace);
        }
        
        return value + (tail || '...');
    }
    
    app.filter('companyCurrency', companyCurrency);

    companyCurrency.$inject = ['$rootScope', '$filter', '$timeout']; 
    function companyCurrency($rootScope, $filter, $timeout) {
    	
        return function(value){
        	
        	if(value == 'undefined' || !$rootScope.companyCurrency)
            	return '';

        	if(!$rootScope.companyCurrency)
        		return value;
        	
    		var formattedValue;
            
            if($rootScope.companyCurrency.after)
            	formattedValue = String.format("{0} {1}", $filter('number')(value, $rootScope.companyCurrency.precision), $rootScope.companyCurrency.symbol);
            else
            	formattedValue = String.format("{0}{1}", $rootScope.companyCurrency.symbol, $filter('number')(value, $rootScope.companyCurrency.precision));
            
            return formattedValue;
        }
    }
    
    app.filter('propsFilter', propsFilter);
    
    propsFilter.$inject = [];	
    function propsFilter() {
  	  return function(items, props) {
  	    var out = [];

  	    if (angular.isArray(items)) {
  	      items.forEach(function(item) {
  	        var itemMatches = false;

  	        var keys = Object.keys(props);
  	        for (var i = 0; i < keys.length; i++) {
  	          var prop = keys[i];
  	          var text = props[prop].toLowerCase();
  	          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
  	            itemMatches = true;
  	            break;
  	          }
  	        }

  	        if (itemMatches) {
  	          out.push(item);
  	        }
  	      });
  	    } else {
  	      // Let the output be the input untouched
  	      out = items;
  	    }

  	    return out;
  	  };
  	};
    
})(angular.module("common.core"));