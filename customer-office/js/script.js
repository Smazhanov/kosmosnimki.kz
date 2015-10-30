
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.183333, lng: 71.4},
    zoom: 5
  });
};

function centerPoly(A,B){
   return [(A[0]+B[0])/2,(A[1]+B[1])/2];
}

function distance(A,B){
	return Math.sqrt((A[0]-B[0])*(A[0]-B[0]) +  (A[1]-B[1])*(A[1]-B[1]));
}

function footprintEdges(footprint){
	var west = footprint[0];
	var east = footprint[0];
	var south = footprint[0];
	var north = footprint[0];
	for(i = 0; i < footprint.length; i++){
		if ( west[0] > footprint[i][0]) west = footprint[i];
		if ( east[0] < footprint[i][0]) east = footprint[i];
		if ( south[1] > footprint[i][1]) south = footprint[i];
		if ( north[1] < footprint[i][1]) north = footprint[i];
	}
	return [west,north,east,south];
}

var imagePolygon = [];

var app = angular.module('myApp', []);

app.controller('myCtrl', [
'$scope',
'$http',
function ($scope, $http, transformRequestAsFormPost){
	
	
	$scope.data = '';
    $scope.sendPost = function() {
		
		var coords = {
				"top": $scope.latFirst,
				"right":$scope.latSecond,
				"bottom" :$scope.latThird,
				"left": $scope.latFourth,
			};
			
		$.post( 
			//"../customer-office/proxy.php",
			"../customer-office/proxy.php",
			{ 
				top: coords.top, 
				right: coords.right, 
				bottom: coords.bottom, 
				left: coords.left 
			}).done(function( data ){
				$scope.data = data;
				
				var arr = [];
				var temp = [];
				var arrGmd = [];
				var cut = '';
				var images =[];
				var image = {
						name: '',
						qlUrl: '',
						resolution:'',
						footprint: []
					};
				var indexStartUsefulInfo = $scope.data.lastIndexOf('net.eads.astrium.faceo.core.apis.catalogue.CatalogueSetRecordResponse/2366861634');
				var indexEndUsefulInfo = $scope.data.lastIndexOf('net.eads.astrium.faceo.core.apis.catalogue.CatalogueResponseInfo/2932340219');
				cut = $scope.data.slice(indexStartUsefulInfo,indexEndUsefulInfo);
				arr = cut.split('"<?xml version=');
				
				/*Самый первый XML имеет плохую структуру begin*/ 
				arrGmd = arr[1].split('<gmd:');
				n = arrGmd.length;
					if (arrGmd[2].split('CharacterString')[1].slice(1,5) === "KM00") { 
							image.resolution = 'MR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,19);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 13].slice(1,64);
							m = arrGmd[72].split('gco:CharacterString>')[1].length;
							temp = arrGmd[72].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,9) === "DS_DZHR1") {
							image.resolution = 'HR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,44);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 3].slice(1,89);
							m = arrGmd[77].split('gco:CharacterString>')[1].length;
							temp = arrGmd[77].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,6) === "ORTHO") {
							var westLong = 0;
							var eastLong = 0;
							var southLat = 0;
							var northLat = 0;
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,24);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 4].slice(1,69);
							westLong = parseFloat(arrGmd[70].split('gco:Decimal>')[1].slice(0,7));
							eastLong = parseFloat(arrGmd[71].split('gco:Decimal>')[1].slice(0,7));
							southLat = parseFloat(arrGmd[72].split('gco:Decimal>')[1].slice(0,7));
							northLat = parseFloat(arrGmd[73].split('gco:Decimal>')[1].slice(0,7));
							image.footprint.push([northLat,westLong],[northLat,eastLong],[southLat,eastLong],[southLat,westLong],[northLat,westLong]);
						}
					
					if (image.name && image.qlUrl && image.footprint) {
						images.push(image);
						var image = {
							name: '',
							qlUrl: '',
							resolution:'',
							footprint: []
						};
					};
				/*  end   */
				
				/* Середина begin*/
				for (i  = 2; i < arr.length-1; i++) {
					arrGmd = arr[i].split('<gmd:');
					n = arrGmd.length;
					if (arrGmd[2].split('CharacterString')[1].slice(1,5) === "KM00") { 
							image.resolution = 'MR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,19);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 3].slice(1,64);
							m = arrGmd[72].split('gco:CharacterString>')[1].length;
							temp = arrGmd[72].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,9) === "DS_DZHR1") {
							image.resolution = 'HR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,44);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 3].slice(1,89);
							m = arrGmd[77].split('gco:CharacterString>')[1].length;
							temp = arrGmd[77].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,6) === "ORTHO") {
							var westLong = 0;
							var eastLong = 0;
							var southLat = 0;
							var northLat = 0;
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,24);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 4].slice(1,69);
							westLong = parseFloat(arrGmd[70].split('gco:Decimal>')[1].slice(0,7));
							eastLong = parseFloat(arrGmd[71].split('gco:Decimal>')[1].slice(0,7));
							southLat = parseFloat(arrGmd[72].split('gco:Decimal>')[1].slice(0,7));
							northLat = parseFloat(arrGmd[73].split('gco:Decimal>')[1].slice(0,7));
							image.footprint.push([northLat,westLong],[northLat,eastLong],[southLat,eastLong],[southLat,westLong],[northLat,westLong]);
						}
				
					
					if (image.name && image.qlUrl && image.footprint) {
						images.push(image);
						var image = {
							name: '',
							qlUrl: '',
							resolution:'',
							footprint: []
						};
					};
				}
				/* end */
				
				/*Самый последний XML имеет плохую структуру begin*/ 
				arrGmd = arr[arr.length-1].split('<gmd:');
				n = arrGmd.length;
					if (arrGmd[2].split('CharacterString')[1].slice(1,5) === "KM00") { 
							image.resolution = 'MR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,19);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 2].slice(1,64);
							m = arrGmd[72].split('gco:CharacterString>')[1].length;
							temp = arrGmd[72].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,9) === "DS_DZHR1") {
							image.resolution = 'HR';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,44);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 3].slice(1,89);
							m = arrGmd[77].split('gco:CharacterString>')[1].length;
							temp = arrGmd[77].split('gco:CharacterString>')[1].slice(0, m-3).split(' ');
							for (j = 0; j < temp.length/2; j++){
								image.footprint.push([parseFloat(temp[2*j+1]),parseFloat(temp[2*j])]);
							}
						}
					if (arrGmd[2].split('CharacterString')[1].slice(1,6) === "ORTHO") {
							var westLong = 0;
							var eastLong = 0;
							var southLat = 0;
							var northLat = 0;
							image.resolution = 'ORTHO';
							image.name = arrGmd[2].split('CharacterString')[1].slice(1,24);
							temp = arrGmd[n-1].split(',');
							image.qlUrl = temp[temp.length - 4].slice(1,69);
							westLong = parseFloat(arrGmd[70].split('gco:Decimal>')[1].slice(0,7));
							eastLong = parseFloat(arrGmd[71].split('gco:Decimal>')[1].slice(0,7));
							southLat = parseFloat(arrGmd[72].split('gco:Decimal>')[1].slice(0,7));
							northLat = parseFloat(arrGmd[73].split('gco:Decimal>')[1].slice(0,7));
							image.footprint.push([northLat,westLong],[northLat,eastLong],[southLat,eastLong],[southLat,westLong],[northLat,westLong]);
						}
					
					if (image.name && image.qlUrl && image.footprint) {
						images.push(image);
						var image = {
							name: '',
							qlUrl: '',
							resolution:'',
							footprint: []
						};
					};
				/*  end   */
				
				$scope.imagesNumber = images.length;
				$scope.images = images;
				/* Построение футпринтов begin*/
				for(i = 0; i < 500; i++){
						if (imagePolygon[i]) imagePolygon[i].setMap(null);
					}
				
				for(i = 0; i < images.length; i++){
					var polygonCoords = [];
					var coord = {};
					for(j = 0; j < images[i].footprint.length; j++){
						coord = {
							lat: images[i].footprint[j][0],
							lng: images[i].footprint[j][1]
						}
						polygonCoords.push(coord);
					}
					
					imagePolygon[i] = new google.maps.Polygon({
						paths: polygonCoords,
						strokeColor: '#43ac38',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#43ac38',
						fillOpacity: 0.35
					});
					imagePolygon[i].setMap(map);
				}
				/* end */
				var marker = [];
				for(j = 0; j < images.length; j++){
					  var centerFootprint = centerPoly(footprintEdges(images[j].footprint)[0],footprintEdges(images[j].footprint)[2]); //Находим центр футпринта
					  var centerNorth = centerPoly(footprintEdges(images[j].footprint)[0],footprintEdges(images[j].footprint)[1]); //Находим центр верхнего края
					  var centerWest = centerPoly(footprintEdges(images[j].footprint)[0],footprintEdges(images[j].footprint)[3]); //Находим центр левого края
					  
					  if (images[j].resolution === 'MR')
					  var imageBounds = {
						  north: centerFootprint[0] + distance(centerFootprint,centerNorth),
						  south: centerFootprint[0] - distance(centerFootprint,centerNorth),
						  east: centerFootprint[1] + distance(centerFootprint,centerWest),
						  west: centerFootprint[1] - distance(centerFootprint,centerWest)
					  };
					  
					  if (images[j].resolution === 'HR')
					  var imageBounds = {
						  north: centerFootprint[0] + distance(centerFootprint,centerWest),
						  south: centerFootprint[0] - distance(centerFootprint,centerWest),
						  east: centerFootprint[1] + distance(centerFootprint,centerNorth),
						  west: centerFootprint[1] - distance(centerFootprint,centerNorth)
					  };
					  
					  /*overlayQuicklook = new google.maps.GroundOverlay(
						  images[j].qlUrl,
						  imageBounds);
					  overlayQuicklook.setMap(map);*/
				}
				
				$scope.$apply();
				
			});
		
    }                   
}]);