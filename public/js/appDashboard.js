var myApp = angular.module('app', [ 'chart.js', 'ui.bootstrap', 'ngMaterial', 'ngFileUpload', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination']);

myApp.service('settingService', function($http) {
	//TODO

});


myApp.config(function (ChartJsProvider) {
	// Configure all charts
	ChartJsProvider.setOptions({
		colours: ['#17B0FD', '#EA80FC', '#FF2D6F', '#46BFBD', '#FFB74D', '#9BFEB7', '#59F783'],
		responsive: true

	});
	// Configure all doughnut charts
	ChartJsProvider.setOptions('Doughnut', {
		animateScale: true
	});    
})

.config(function($mdThemingProvider) {

	$mdThemingProvider.theme('default')
	.primaryPalette('pink', {  //pink
		'default': '400', // by default use shade 400 from the pink palette for primary intentions
		'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
		'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
		'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
	})
	// If you specify less than all of the keys, it will inherit from the
	// default shades
	.accentPalette('grey', {
		'default': '100' // use shade 200 for default, and keep all other shades the same
	});
})

/*
  .config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .dark();
	} )
 */
.controller('DashBoardController',function($scope, $http, Upload){

  $scope.showFormValue = false;
  $scope.showDashBoardValue = true;
  $scope.showChartByCampaignValue = false;
  $scope.showPreview = false;
  $scope.isEditedImage = false;
  $scope.isNewCampaignForm=true;

  $scope.campaigns = [];

  $scope.campaign = {};

  $scope.age = {};
  $scope.age.labels = ["13-17", "18-21", "22 Up","Unknown"];
  
  $scope.gender = {};
  $scope.gender.labels = ["Male", "Female", "Unknown"];
  
  $scope.visitor = {};
  $scope.visitor.series = ["Visitors Respond"];
  
  ////////////////////////////////////////////////////////////////////
  // Fetch Campaigns
  ///////////////////////////////////////////////////////////////////
		$http.get("/rest/campaign/list")
		.success(function(response) {
			//console.log("response: "+ response.campaigns);
			$scope.campaigns = response.campaigns;
			
			if(typeof $scope.campaigns == 'undefined') {
				return;
			}

			for(var i = 0;i< $scope.campaigns.length;i++){
				var tmpProgress = 100-(i*7);
				if(tmpProgress>0){
					$scope.campaigns[i].progress = tmpProgress;
				}else{
					$scope.campaigns[i].progress = 0;
				}
					
			}

			var firstCampaigns = $scope.campaigns[0];
			 $scope.campaignName = firstCampaigns.name;
			

			  $scope.age.data = firstCampaigns.age.data;
			  $scope.age.options = { segmentShowStroke : true};
			
			  
			  $scope.gender.data = firstCampaigns.gender.data;
			  $scope.gender.options = { segmentShowStroke : true};
			
			
			  $scope.visitor.labels = firstCampaigns.visitor.labels;
			  $scope.visitor.data = firstCampaigns.visitor.data;
			  
			  console.log('campaign visitor labels: ' + $scope.visitor.labels);
			  console.log('data: ' + $scope.visitor.data);
			  $scope.visitor.onClick = function (points, evt) {
			    console.log(points, evt);
			  };

		});
		
		$scope.doClickListCampaigns = function(){
			$scope.showFormValue=false; 
			$scope.showDashBoardValue=true; 
			$scope.showChartByCampaignValue=false;
		}
		
	$scope.doClickBtnCancel = function(){
		$scope.showFormValue=false; 
		$scope.showDashBoardValue=true; 
		$scope.showChartByCampaignValue=false;
	}
		
	$scope.loadData = function(campaignId){
	//	alert(campaignId);
		
		if(typeof campaignId != 'undefined') {
			$http.get("/rest/campaign/get/"+ campaignId)
			.success(function(response) {
				console.log("response selectedCampaign check: "+ response.campaigns);
				if(typeof response.campaigns != 'undefined') {
					$scope.showDashBoardValue = false;
					$scope.showChartByCampaignValue = true;
					$scope.selectedCampaign = response.campaigns;
					console.log("response selectedCampaign campaigns: "+ $scope.selectedCampaign.name);
					console.log("response selectedCampaign JSON: "+ JSON.stringify($scope.selectedCampaign));
					
					$scope.campaignName = $scope.selectedCampaign.name;
				    $scope.age.data = $scope.selectedCampaign.age.data;
				    $scope.gender.data = $scope.selectedCampaign.gender.data;
				    $scope.visitor.data = $scope.selectedCampaign.visitor.data;
				}
			});
		}
	    
  }



	//Pung Add

    $scope.reloadCampaignList = function(){
		$http.get("/rest/campaign/list")
		.success(function(response) {
			$scope.campaigns = response.campaigns;
			
			for(var i = 0;i< $scope.campaigns.length;i++){
				var tmpProgress = 100-(i*7);
				if(tmpProgress>0){
					$scope.campaigns[i].progress = tmpProgress;
				}else{
					$scope.campaigns[i].progress = 0;
				}
					
			}
		});
    };

	 	$scope.date = new Date();
	$scope.createCampaign = function(){
		//alert(JSON.stringify($scope.campaign));
		$scope.campaign.period = {};
		$scope.campaign.period.from = angular.element($("#periodFrom")).val();
		$scope.campaign.period.to = angular.element($("#periodTo")).val();
		$http.post('/campaigns/create', $scope.campaign).then(function(response) {
			$scope.showFormValue = false;
  			$scope.showDashBoardValue = true;
  			$scope.reloadCampaignList();
  			$scope.campaign = {};
  			angular.element($("#image-holder")).html("");
  			angular.element($("#image-holder-preview")).html("");
  			angular.element($("#fileUpload")).val("");
  			angular.element($("#periodFrom")).val("");
  			angular.element($("#periodTo")).val("");
  			
  		}, function(error){

		});
	};
	
	$scope.addCampaign = function(){
		$scope.showFormValue=true;
		$scope.showDashBoardValue=false;
  		$scope.isNewCampaignForm = true;
  		$scope.isEditedImage=false;
		$scope.campaign = {};
		angular.element($("#image-holder")).html("");
  		angular.element($("#image-holder-preview")).html("");
  		angular.element($("#fileUpload")).val("");
  		angular.element($("#periodFrom")).val("");
  		angular.element($("#periodTo")).val("");
  		angular.element($("#dateFrom")).addClass("is-dirty");
  		angular.element($("#dateTo")).addClass("is-dirty");
	};

	$scope.getCampaign = function(campaignId){
		$http.get('/campaigns/get/'+campaignId).then(function(response) {
			angular.element($(".mdl-textfield")).addClass("is-dirty");
			$scope.campaign = response.data;
			$scope.showFormValue = true;
  			$scope.showDashBoardValue = false;
  			$scope.isNewCampaignForm = false;
  			$scope.isEditedImage=true;
  			if($scope.campaign.imagePath == undefined){
  				$scope.isEditedImage=false;
  			}
  			angular.element($("#image-holder")).html("");
  			angular.element($("#image-holder-preview")).html("");
  			angular.element($("#fileUpload")).val("");
  			angular.element($("#periodFrom")).val($scope.campaign.period.from);
  			angular.element($("#periodTo")).val($scope.campaign.period.to);
  		}, function(error){

		});
	};
	
	$scope.updateCampaign = function(){
		$scope.campaign.period = {};
		$scope.campaign.period.from = angular.element($("#periodFrom")).val();
		$scope.campaign.period.to = angular.element($("#periodTo")).val();
		$http.post('/campaigns/update', $scope.campaign).then(function(response) {
			alert("Updated Completed");
			$scope.showFormValue = false; 
			$scope.showDashBoardValue = true;
  		}, function(error){

		});
	};
	
 	$scope.upload = function (file) {
 		$scope.isEditedImage = false;
        Upload.upload({
            url: '/campaigns/upload/image/',
            fields: {'username': 'test'},
            file: file
        }).progress(function (evt) {
        	alert('Uploading');
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
        	alert('Upload Completed');
        	$scope.campaign.imagePath = data.substring(data.indexOf("/") + 1, data.length);
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        });
    };



    $scope.selectCampaignArray = [];

    $scope.selectCampaign = function(campaignid){
    	var index = $scope.selectCampaignArray.indexOf(campaignid);
    	if( index > -1){
    		$scope.selectCampaignArray.splice(index,1);
    	}else{
    		$scope.selectCampaignArray.push(campaignid);
    	}
    };

	$scope.deleteCampaign = function(){
		$http.post('/campaigns/delete', {'selectCampaignArray': $scope.selectCampaignArray}).then(function(response) {
            $scope.reloadCampaignList();
  		}, function(error){

		});
	};
	//End Pung Add


})

.directive('campaign', function() {
  return {
    templateUrl: '../campaignform.html'
  };
})

.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.gridOptions1 = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    columnDefs: [
      { name: 'name' },
      { name: 'gender' },
      { name: 'company' }
    ]
  };

  $scope.gridOptions2 = {
    enablePaginationControls: false,
    paginationPageSize: 25,
    columnDefs: [
      { name: 'name' },
      { name: 'gender' },
      { name: 'company' }
    ]
  };

  $scope.gridOptions2.onRegisterApi = function (gridApi) {
    $scope.gridApi2 = gridApi;
  }

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100.json')
  .success(function (data) {
    $scope.gridOptions1.data = data;
    $scope.gridOptions2.data = data;
  });
}])
.controller('CampaignDashboardListCtrl', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
  $scope.gridOptions = {
    enableRowSelection: true,
    enableSelectAll: true,
    selectionRowHeaderWidth: 35,
    rowHeight: 35,
    showGridFooter:true
  };

  $scope.gridOptions.columnDefs = [
    { name: 'id' },
    { name: 'name'},
    { name: 'age', displayName: 'Age (not focusable)', allowCellFocus : false },
    { name: 'address.city' }
  ];

  $scope.gridOptions.multiSelect = true;

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    .success(function(data) {
      $scope.gridOptions.data = data;
      $timeout(function() {
        if($scope.gridApi.selection.selectRow){
          $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
        }
      });
    });

    $scope.info = {};

    $scope.toggleMultiSelect = function() {
      $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
    };

    $scope.toggleModifierKeysToMultiSelect = function() {
      $scope.gridApi.selection.setModifierKeysToMultiSelect(!$scope.gridApi.grid.options.modifierKeysToMultiSelect);
    };

    $scope.selectAll = function() {
      $scope.gridApi.selection.selectAllRows();
    };

    $scope.clearAll = function() {
      $scope.gridApi.selection.clearSelectedRows();
    };

    $scope.toggleRow1 = function() {
      $scope.gridApi.selection.toggleRowSelection($scope.gridOptions.data[0]);
    };

    $scope.toggleFullRowSelection = function() {
      $scope.gridOptions.enableFullRowSelection = !$scope.gridOptions.enableFullRowSelection;
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };

    $scope.setSelectable = function() {
      $scope.gridApi.selection.clearSelectedRows();

      $scope.gridOptions.isRowSelectable = function(row){
        if(row.entity.age > 30){
          return false;
        } else {
          return true;
        }
      };
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

      $scope.gridOptions.data[0].age = 31;
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    };

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row selected ' + row.isSelected;
        $log.log(msg);
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'rows changed ' + rows.length;
        $log.log(msg);
      });
    };
}])

.controller('SecondCtrl', ['$scope', '$http', '$interval', 'uiGridConstants', function ($scope, $http, $interval, uiGridConstants) {
  $scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };

  $scope.gridOptions.columnDefs = [
    { name: 'id' },
    { name: 'name'},
    { name: 'age', displayName: 'Age (not focusable)', allowCellFocus : false },
    { name: 'address.city' }
  ];

  $scope.gridOptions.multiSelect = false;
  $scope.gridOptions.modifierKeysToMultiSelect = false;
  $scope.gridOptions.noUnselect = true;
  $scope.gridOptions.onRegisterApi = function( gridApi ) {
    $scope.gridApi = gridApi;
  };

  $scope.toggleRowSelection = function() {
    $scope.gridApi.selection.clearSelectedRows();
    $scope.gridOptions.enableRowSelection = !$scope.gridOptions.enableRowSelection;
    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
  };

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    .success(function(data) {
      $scope.gridOptions.data = data;

      // $interval whilst we wait for the grid to digest the data we just gave it
      $interval( function() {$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);}, 0, 1);
    });
}])

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//			Main Dashboard
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("DashMsgCheckDataController", function ($scope, $http, settingService) {
	$scope.message = "No Data";
	$scope.data = null;
    $scope.statusCode = -1;

	$scope.checkDashboardData = function() {
		var dashMessageChaeckData = document.getElementById('DashMessageChaeckData');
		
		setTimeout(function(){
		//$http.get(getRestServiceEndpointUrl() + "/dashboard/sites")
		$http.get("/sample_json/testDashCheckDataController.json")
		//	$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy + "/1" )
		.success(function(response) {
			console.log("TODO: checkDashboardData...." + getSelectedSite());
			console.log("TODO: checkDashboardData : "+ response);
			$scope.data = response.data;
			$scope.statusCode = response.statusCode;
			
			if( (typeof $scope.data == "undefined") ||$scope.data == null || $scope.data.length==0) {				
				dashMessageChaeckData.style.display = 'block';				
			}else{
				dashMessageChaeckData.style.display = 'none';	
			}
			
			handleDisplayChartBySiteSelection();
		});
		
		
		console.log("$scope.data: "+ $scope.data);
		
		
//		if ($scope.statusCode != 200) {
//			$scope.message = $scope.statusCode + ":"+  'Cannot connected to web service';
//		}
		
		},10);
	};
	$scope.clickme=function(){
		//alert('test click ');
	}


	$scope.checkDashboardData();
})

.controller("DashPieAvgUsersController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;

	$scope.loadDashPieAvgUsers = function() {

		console.log("DashPieAvgUsersController selectSite: " + getSelectedSite() + " - reportBy: " + getSelectedReportBy());

		console.log("DashPieAvgUsersController url: " +getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/1");
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/1" )
			//$http.get("/sample_json/testDashPieAvgUsersControllerBySite.json")
			.success(function(response) {
				console.log("TODO: Chart No. #SC1: DashPieAvgUsersController by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC1: response: " + response);
				$scope.labels = response.labels;
				$scope.data = response.data;
			});	
		},100);
		

	};
	$scope.clickme=function(){
		//alert('test click PieAvgUsers');
	}
	
	if(document.getElementById('sectionViewBySiteMain').style.display == 'block'){
		$scope.loadDashPieAvgUsers();
	}
	
})



.controller("DashPieDevicesController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieDevices = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashPieDevicesControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/2" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC2: DashPieDevicesController by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC2: response: " + response);
				$scope.labels = response.devices;
				$scope.data = response.data;
			});	
		},100);
		
	};
	$scope.clickme=function(){
		//alert('test click ');
	}
	
	if(document.getElementById('sectionViewBySiteMain').style.display == 'block'){
		$scope.loadDashPieDevices();
	}

})

.controller("DashPeakHourVisitorController", function ($scope, $http, settingService) {
	$scope.data = "";

	$scope.loadDashPeakHourVisitor = function() {
		setTimeout(function(){
			//$http.get("/sample_json/testDashPeakHourVisitorControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/3" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC3: DashPeakHourVisitor by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC3: response: " + response);
				$scope.data = response.data;
			});	
		},100);
		
	};
	if(document.getElementById('sectionViewBySiteMain').style.display == 'block'){
		$scope.loadDashPeakHourVisitor();
	}

})

.controller("DashLineVisitorController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];
	$scope.onClick = function (points, evt) {
		console.log("Do Clicking DashLineVisitorController ");
		console.log(points, evt);
		
		document.getElementById('sectionViewBySiteMain').style.display = 'none';
		document.getElementById('sectionViewBySiteDetail').style.display = 'block';
		
		reloadVisitorDetailChartBySite();
		
	};


	$scope.loadDashLineVisitor = function() {
		setTimeout(function(){
			//$http.get("/sample_json/testDashLineVisitorControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/4" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC4: loadDashLineVisitor by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC4: response: " + response);
				$scope.series = response.series;
				$scope.data = response.data;
				$scope.labels = response.labels;
			});	
		
		},100);
	};

	$scope.clickme=function(){
		//alert('test click ');
	}
	if(document.getElementById('sectionViewBySiteMain').style.display === 'block'){
		$scope.loadDashLineVisitor();
	}
})


.controller("DashPieGenderUserController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieGenderuser = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashPieGenderUserControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/5" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC5: loadDashPieGenderuser by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC5: response: " + response);
				$scope.labels = response.status;
				$scope.data = response.data;    	  
			});	
		},100);

	};
	$scope.clickme=function(){
		//alert('test click ');
	}

	if(document.getElementById('sectionViewBySiteDetail').style.display == 'block') {
		$scope.loadDashPieGenderuser();
	}
})

.controller("DashPieAgeController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieAge = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashPieAgeControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/6" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC6: loadDashPieAge by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC6: response: " + response);
				$scope.labels = response.labels;
				$scope.data = response.data;
			});	
		},100);
		
	};
	$scope.clickme=function(){
		//alert('test click ');
	}
	if(document.getElementById('sectionViewBySiteDetail').style.display == 'block') {
		$scope.loadDashPieAge();
	}
})


.controller("DashPieLoyaltyController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieLoyalty = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashPieLoyaltyController.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/7" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC7:  loadDashPieLoyalty by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC7: response: " + response);
				$scope.labels = response.labels;
				$scope.data = response.data;
			});	
		},100);
		
	};
	$scope.clickme=function(){
		//alert('test click ');
	}
	if(document.getElementById('sectionViewBySiteDetail').style.display == 'block') {
		$scope.loadDashPieLoyalty();
	}
})


.controller("DashBarLoyaltyController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];
	$scope.legend = true;

	$scope.loadDashBarLoyalty = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashBarLoyaltyControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/8" )
			.success(function(response) {
				console.log("TODO: Chart No. #SC8:  loadDashBarLoyalty by site...." + getSelectedSite());
				console.log("TODO: Chart No. #SC8: response: " + response);
				$scope.labels = response.labels;
				$scope.series = response.series;
				$scope.data = response.data;
			});	
		},100);
		
	};
	if(document.getElementById('sectionViewBySiteDetail').style.display == 'block') {
		$scope.loadDashBarLoyalty();
	}
})


.controller("DashBarDurationController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];
	$scope.legend = true;

	$scope.loadDashBarDuration = function() {
		
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/9" )
//			$http.get("/sample_json/testDashBarDurationControllerBySite.json")
			.success(function(response) {
				console.log("TODO: Chart No. #SC9:  loadDashBarDuration by site...."  + getSelectedSite());
				console.log("TODO: Chart No. #SC9: response: " + response);
				$scope.labels = response.labels;
				$scope.series = response.series;
				$scope.data = response.data;
			});	
		
		 },100);
	};
	if(document.getElementById('sectionViewBySiteDetail').style.display == 'block') {
		$scope.loadDashBarDuration();
	}

})


///////////////////////// ///////////////////////////////////////////////////
//Generate Charts Controllers for All Sites 
////////////////////////////////////////////////////////////////////////////


.controller("DashBarLoyaltyAllSitesController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashBarLoyaltyAllSites = function() {

		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/10" )
//			$http.get("/sample_json/testDashBarLoyaltyAllSitesController.json")
			.success(function(response) {
				console.log("TODO: Chart No.#1 loadDashBarLoyaltyAllSites...." + getSelectedSite());
				console.log("TODO: Chart No.#1: response: " + response);
				$scope.labels = response.labels;
				$scope.series = response.series;
				$scope.data = response.data;
			});	
		},100);

	};
	
//	if(document.getElementById('sectionViewByAllSiteMain').style.display == 'block'){
		$scope.loadDashBarLoyaltyAllSites();
//	}
})

.controller("DashBarAgeAllSitesController", function ($scope, $http, settingService) {
	$scope.legend = true;

	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];


	$scope.loadDashBarAgeAllSites = function() {

		setTimeout(function(){
//			$http.get("/sample_json/testDashBarAgeAllSitesController.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/11" )
			.success(function(response) {
				console.log("TODO:Chart No.#2  loadDashBarAgeAllSites...." + getSelectedSite());
				console.log("TODO:Chart No.#2: response: " + response);
				$scope.labels = response.labels;
				$scope.series = response.series;
				$scope.data = response.data;
			});	

		},100);
	};
//	if(document.getElementById('sectionViewByAllSiteMain').style.display == 'block'){
		$scope.loadDashBarAgeAllSites();
//	}

})



.controller("DashLineVisitorAllSiteController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];
	$scope.onClick = function (points, evt) {
		console.log("Do Clicking DashLineVisitorAllSiteController ");
		console.log(points, evt);
		
		document.getElementById('sectionViewByAllSiteMain').style.display = 'none';
		document.getElementById('sectionViewByAllSiteDetail').style.display = 'block';
		
		reloadVisitorDetailChartByAllSite();
		
	};


	$scope.loadDashLineVisitor = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashLineVisitorControllerBySite.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/12" )
			.success(function(response) {
				console.log("TODO: Chart No.#3  loadDashLineVisitor by all site...." + getSelectedSite());
				console.log("TODO:Chart No.#3: response: " + response);
				$scope.labels = response.labels;
				$scope.series = response.series;
				$scope.data = response.data;
			});	
		
		},100);
	};

	$scope.clickme=function(){
		//alert('test click ');
	}
	//if(document.getElementById('sectionViewByAllSiteMain').style.display == 'block'){
		$scope.loadDashLineVisitor();
	//}
})

.controller("DashPieGenderController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieGender = function() {
		setTimeout(function(){
//			$http.get("/sample_json/testDashPieGenderControllerAllSites.json")
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/13" )
			.success(function(response) {
				console.log("TODO:Chart No.#4  loadDashPieGender all sites...."  + getSelectedSite());
				console.log("TODO:Chart No.#4: response: " + response);
				$scope.labels = response.gender;
				$scope.data = response.data;
			});	
		},100);

	};
	$scope.clickme=function(){
		//alert('test click ');
	}

	//if(document.getElementById('sectionViewByAllSiteMain').style.display == 'block'){
		$scope.loadDashPieGender();
	//}
})



.controller("DashPieVisitorsAllSitesController", function ($scope, $http, settingService) {
	$scope.labels = [];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieVisitors = function() {
		setTimeout(function(){

		$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/14" )
//		$http.get("/sample_json/testDashPieVisitorsAllSitesController.json")
		.success(function(response) {
			console.log("TODO:Chart No.#5  loadDashPieVisitors all sites...."  + getSelectedSite());
			console.log("TODO:Chart No.#5: response: " + response);
			$scope.labels = response.labels;
			$scope.data = response.data;
		});	

		},100);
	};
	$scope.clickme=function(){
		//alert('test click ');
	}

//	if(document.getElementById('sectionViewByAllSiteMain').style.display == 'block'){
		$scope.loadDashPieVisitors();
	//}
})


.controller("DashBarVisitorsStatusAllSitesController", function ($scope, $http, settingService) {
	$scope.legend = true;

	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];


	$scope.loadDashBarVisitorStatusAllSites = function() {
			
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/15" )
//		$http.get("/sample_json/testDashBarVisitorsStatusAllSitesController.json")
		.success(function(response) {
			console.log("TODO: Chart No.#6 loadDashBarVisitorStatusAllSites...." + getSelectedSite());
			console.log("TODO: Chart No.#6: response: " + response);
			$scope.labels = response.labels;
			$scope.series = response.series;
			$scope.data = response.data;

		});	
		 },100);
	};
	
	if(document.getElementById('sectionViewByAllSiteDetail').style.display == 'block') {
		$scope.loadDashBarVisitorStatusAllSites();
	}
	
})


.controller("DashBarLoyaltyVisitorAllSitesController", function ($scope, $http, settingService) {
	$scope.legend = true;

	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];


	$scope.loadDashBarLoyaltyVisitorAllSites = function() {
		
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/16" )
//		$http.get("/sample_json/testDashBarLoyaltyVisitorAllSitesController.json")
		.success(function(response) {
			console.log("TODO: Chart No.#7 loadDashBarLoyaltyVisitorAllSites...." + getSelectedSite());
			console.log("TODO: Chart No.#7: response: " + response);
			$scope.labels = response.labels;
			$scope.series = response.series;
			$scope.data = response.data;
		});	
		 },100);
	};
	if(document.getElementById('sectionViewByAllSiteDetail').style.display == 'block') {
		$scope.loadDashBarLoyaltyVisitorAllSites();
	}
})



.controller("DashPieNewVisitorsController", function ($scope, $http, settingService) {
	$scope.labels =[];
	$scope.data = [];
	$scope.legend = true;


	$scope.loadDashPieNewVisitors = function() {
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/"+getSelectedSite()+"/" + getSelectedReportBy() + "/17" )
//		$http.get("/sample_json/testDashPieNewVisitorsController.json")
		.success(function(response) {
			console.log("TODO:Chart No.#8  loadDashPieNewVisitors...." + getSelectedSite());
			console.log("TODO:Chart No.#8: response: " + response);
			$scope.labels = response.labels;
			$scope.data = response.data;
		});	

		},100);
	};
	$scope.clickme=function(){
		//alert('test click ');
	}

	if(document.getElementById('sectionViewByAllSiteDetail').style.display == 'block') {
		$scope.loadDashPieNewVisitors();
	}
})




.controller('ButtonsReportByCtrl', function ($scope) {
	$scope.singleModel = 1;

	$scope.radioModel = 'daily';

	$scope.checkModel = {
			hourly: false,
			daily: true,
			monthly: false
	};

	$scope.checkResults = [];

	$scope.$watchCollection('checkModel', function () {
		$scope.checkResults = [];
		angular.forEach($scope.checkModel, function (value, key) {
			if (value) {
				$scope.checkResults.push(key);
			}
		});
	});

	$scope.changeViewType = function() {
		reloadAllChart();
	}
})


.controller('DropdownSiteController', function ($scope, $http, $timeout) {

	$scope.selectedSite = "all";
	$scope.sites =  $scope.sites  || [
	                                  { id: "all", name: 'All Sites' }
	                                  ];

	$scope.loadSites = function() {
		setTimeout(function(){
			$http.get(getRestServiceEndpointUrl() + "/dashboard/sites")
			//$http.get("/sample_json/test.json")
			.success(function(response) {
				console.log("TODO: loadAllSites....");
				console.log("response.sites: "  +  response.sites);
				$scope.sites =  response.sites ;
			});	


		 },100);
	};



	$scope.loadSites();

	///////////////////////////////////////////
	// Generate all charts
	///////////////////////////////////////////
	$scope.generateAllChart = function() {
		console.log('loading  generateAllChart');
		reloadAllChart();
		

	}
	


})
;

handleDisplayChartBySiteSelection = function() {
	var objViewAllSite = document.getElementById('viewAllSite');
	var objViewBySite = document.getElementById('viewBySite');
	var dashMessageChaeckData = document.getElementById('DashMessageChaeckData');
	
//	alert(getSelectedSite() );
	
	if(dashMessageChaeckData.style.display == 'none') {
		if (getSelectedSite() == "all") {
			objViewAllSite.style.display = 'block';
			objViewBySite.style.display = 'none';
			document.getElementById('sectionViewByAllSiteMain').style.display = 'block';
			document.getElementById('sectionViewByAllSiteDetail').style.display = 'none';
		} else {
			objViewAllSite.style.display = 'none';
			objViewBySite.style.display = 'block';
			document.getElementById('sectionViewBySiteMain').style.display = 'block';
			document.getElementById('sectionViewBySiteDetail').style.display = 'none';
		}
	}else{
		objViewAllSite.style.display = 'none';
		objViewBySite.style.display = 'none';
		document.getElementById('sectionViewByAllSiteDetail').style.display = 'none';
		document.getElementById('sectionViewBySiteDetail').style.display = 'none';
	}
}


getRestServiceEndpointUrl = function() {
	return 'http://merakicampaign.mybluemix.net/rest';
	//"http://merakicampaign.mybluemix.net/rest/dashboard/avgusers
}

getSelectedSite = function () {
	var selectSite = angular.element(document.getElementById('DropdownSite')).scope().selectedSite;
	if(  (selectSite != null) &&!(typeof  selectSite.id == 'undefined')  ) {
		return angular.element(document.getElementById('DropdownSite')).scope().selectedSite.id;
	} else {
		return "all";
	}

};


getSelectedReportBy = function () {
	if(typeof  angular.element(document.getElementById('ButtonsReportBy')).scope().radioModel != 'undefined') {
		return angular.element(document.getElementById('ButtonsReportBy')).scope().radioModel;
	} else {
		return 'dayOfWeek';
	}

};



///////////////////////////////////////////
// reload all charts
///////////////////////////////////////////
reloadAllChart = function() {
	console.log('loading  reloadAllChart');
	handleDisplayChartBySiteSelection();

	if(document.getElementById('viewBySite').style.display == 'block'){
		
		angular.element(document.getElementById('DashPieAvgUsers')).scope().loadDashPieAvgUsers();
		angular.element(document.getElementById('DashPieDevices')).scope().loadDashPieDevices();
		angular.element(document.getElementById('DashPeakHourVisitor')).scope().loadDashPeakHourVisitor();
		angular.element(document.getElementById('DashLineVisitor')).scope().loadDashLineVisitor();

		if(document.getElementById('sectionViewBySiteDetail').style.display == 'block'){
			reloadVisitorDetailChartBySite();
		}
	}
	
	if(document.getElementById('viewAllSite').style.display == 'block'){
		angular.element(document.getElementById('DashBarLoyaltyAllSites')).scope().loadDashBarLoyaltyAllSites();
		angular.element(document.getElementById('DashBarAgeAllSites')).scope().loadDashBarAgeAllSites();

		angular.element(document.getElementById('DashLinePasserVisitorAllSites')).scope().loadDashLineVisitor();
		angular.element(document.getElementById('DashPieGender')).scope().loadDashPieGender();
		angular.element(document.getElementById('DashPieVisitors')).scope().loadDashPieVisitors();
		
		if(document.getElementById('sectionViewByAllSiteDetail').style.display == 'block'){
			reloadVisitorDetailChartByAllSite();
		}
	}

}



/////////////////////////////////////////////////////////////////////////////
//
//     Reload Visitor Detail Charts by Site  
//
/////////////////////////////////////////////////////////////////////////////
reloadVisitorDetailChartBySite = function() {
	console.log('loading  reloadVisitorDetailChartBySite');


	angular.element(document.getElementById('DashPieGenderUser')).scope().loadDashPieGenderuser();
	angular.element(document.getElementById('DashPieAge')).scope().loadDashPieAge();
	angular.element(document.getElementById('DashPieLoyalty')).scope().loadDashPieLoyalty();
	angular.element(document.getElementById('DashBarLoyalty')).scope().loadDashBarLoyalty	();
	angular.element(document.getElementById('DashBarDuration')).scope().loadDashBarDuration();


}




/////////////////////////////////////////////////////////////////////////////
//
//Reload Visitor Detail Charts by All Site  
//
/////////////////////////////////////////////////////////////////////////////
reloadVisitorDetailChartByAllSite = function() {
console.log('loading  reloadVisitorDetailChartByAllSite');

angular.element(document.getElementById('DashBarVisitorsStatusAllSites')).scope().loadDashBarVisitorStatusAllSites();
angular.element(document.getElementById('DashBarLoyaltyVisitorAllSites')).scope().loadDashBarLoyaltyVisitorAllSites();
angular.element(document.getElementById('DashPieNewVisitors')).scope().loadDashPieNewVisitors();

}


window.addEventListener('hashchange', function() {
	if (window.location.hash === '#action_view') {
		console.log(' ON CLICK VIEW ACTION ');
	}
});


/////////////////////////////////////////////////////////////////////////////////////////////////
/*
(function () {
	  'use strict';
	  angular
	      .module('selectDemoBasic', ['ngMaterial'])
	      .controller('AppCtrl', function() {
	        this.userState = '';
	        this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
	            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
	            'WY').split(' ').map(function (state) { return { abbrev: state }; });
	      });
	})();
 */
