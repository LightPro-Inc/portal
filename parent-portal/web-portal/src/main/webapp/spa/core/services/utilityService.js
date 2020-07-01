(function(app){
	'use strict';

	app.factory('utilityService', utilityService);

	function utilityService(){
		var service = {
		    clone: clone,
		    findSingle: findSingle,
		    replace: replace,
		    remove: remove,
		    convertImgToDataURLviaCanvas: convertImgToDataURLviaCanvas,
		    convertFileToDataURLviaFileReader: convertFileToDataURLviaFileReader
		};

		function clone(srcInstance){
            /*Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne*/
            if (typeof (srcInstance) != 'object' || srcInstance == null || srcInstance == undefined) {
                return srcInstance;
            }

            /*On appel le constructeur de l'instance source pour crée une nouvelle instance de la même classe*/
            var newInstance = new srcInstance.constructor();
            /*On parcourt les propriétés de l'objet et on les recopies dans la nouvelle instance*/
            for (var i in srcInstance) {
                newInstance[i] = clone(srcInstance[i]);
            }
            /*On retourne la nouvelle instance*/
            return newInstance;
		}

		function findSingle(list, keyName, keyValue) {
		    var itemFound = null;

		    angular.forEach(list, function (value) {
		        if (value[keyName] == keyValue)
		            itemFound = value;
		    });

		    return itemFound;
		}

		function remove(list, keyName, keyValue) {
		    angular.forEach(list, function (value, index) {
		        if (value[keyName] == keyValue)
		            list.splice(index, 1);
		    });
		}

		function replace(list, oldItem, newItem, keyName) {
		    var index = null;

		    angular.forEach(list, function (value, i) {
		        if (value[keyName] == oldItem[keyName])
		            index = i;
		    });

		    if (index != null)
		        list.splice(index, 1, newItem);
		}

		function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
		    var img = new Image();
		    img.crossOrigin = 'Anonymous';
		    img.onload = function () {
		        var canvas = document.createElement('CANVAS');
		        var ctx = canvas.getContext('2d');
		        var dataURL;
		        canvas.height = this.height;
		        canvas.width = this.width;
		        ctx.drawImage(this, 0, 0);
		        dataURL = canvas.toDataURL(outputFormat);
		        callback(dataURL);
		        canvas = null;
		    };
		    img.src = url;
		}

		function convertFileToDataURLviaFileReader(url, callback) {
		    var xhr = new XMLHttpRequest();
		    xhr.responseType = 'blob';
		    xhr.onload = function () {
		        var reader = new FileReader();
		        reader.onloadend = function () {
		            callback(reader.result);
		        }
		        reader.readAsDataURL(xhr.response);
		    };
		    xhr.open('GET', url);
		    xhr.send();
		}

		return service;
	}

})(angular.module('common.core'));