(function(app){
	'use strict';
	
	app.factory('contactService', contactService);
	
	contactService.$inject = ['$uibModal'];
	function contactService($uibModal){
		
		function edit(contact, callback){

			if(!contact.natureId)
				return;
			
			var templateUrl, controller;
			
			switch(contact.natureId){
				case 1:
					templateUrl = 'modules/contacts/features/contact/editContactPersonView.html';
					controller = 'editContactPersonCtrl as vm';
					break;
				case 2:
					templateUrl = 'modules/contacts/features/contact/editContactSocietyView.html';
					controller = 'editContactSocietyCtrl as vm';
					break;
			}
			
			$uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                size: "lg",
                resolve: {
                    data: {
                    	id : contact.id
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });           
		}
		
		function search(filter, callback) {
            $uibModal.open({
                templateUrl: 'modules/contacts/features/contact/contactSearchView.html',
                controller: 'contactSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                        filter: filter
                    }
                }
            }).result.then(function (contact) {
            	if(callback)
            		callback(contact)
            }, function () {
            	
            });
        }
		
		return {
			edit : edit,
			search: search
		}
	}
})(angular.module('common.core'));