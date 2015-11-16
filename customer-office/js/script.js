/*datepicker begin*/

$(document).ready(function() {

	$.datepicker.regional["ru"] = {
		closeText: 'Готово', // set a close button text
    		currentText: 'Сегодня', // set today text
    		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',   'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], // set month names
  	        monthNamesShort: ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'], // set short month names
 		dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], // set days names
    		dayNamesShort: ['Вос','Пон','Вт','Ср','Чет','Пят','Суб'], // set short day names
    		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], // set more short days names
    		dateFormat: 'dd/mm/yy', // set format date
    		nextText: "Следующий",
    		prevText: "Предыдущий"
	};
	$.datepicker.setDefaults($.datepicker.regional["ru"]); 
	//$.datepicker.setDefaults($.extend($.datepicker.regional["ru"]));
  	$('.datepickInput').datepicker();		
});
/*end*/

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.183333, lng: 71.4},
    zoom: 5
  });
};

/* Abyl begin*/
function date2code(secs,f) {
	const a = 1350000;
	var b;
	if (f=='A')
		b = 1012500;
	else 
		b = 2362499;
	var y = (secs/1000/3600-18)/24;
	var x = a*y+b;
	var binXStr = x.toString(2);
	var mask = 0x0000003f;
	var code = '';
	var c;
	while(binXStr.length % 6 != 0)
		binXStr = '0'+binXStr;
	y = parseInt(binXStr.slice(0,6),2);
	x = parseInt(binXStr.slice(6),2);
	for(var i=0;i<5;i++){
		var k = x & mask;
		if(k<26) 
			c = String.fromCharCode('A'.charCodeAt(0)+k);
		else if (k<52)
			c = String.fromCharCode('a'.charCodeAt(0)+(k-26));
		else if (k<62)
			c = String.fromCharCode('0'.charCodeAt(0)+(k-52));
		else if (k==62)
			c = '$';
		else //if k==63 
			c = '_';
		code = c + code;
		x=x>>6;
	}
	if(y<26) 
		c = String.fromCharCode('A'.charCodeAt(0)+y);
	else if (y<52)
		c = String.fromCharCode('a'.charCodeAt(0)+(y-26));
	else if (y<62)
		c = String.fromCharCode('0'.charCodeAt(0)+(y-52));
	else if (y==62)
		c = '$';
	else //if k==63 
		c = '_';
	code = c + code + f;

	//k >> 30;
	return code;
};
/*end*/

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
	$scope.allPeriod = false;

	$scope.latFirst = 50.2;
	$scope.latSecond = 50.3;
	$scope.latThird = 50.4;
	$scope.latFourth = 50.5;
	$scope.startDate = "01/01/2015";
	$scope.endDate = "08/07/2015";

    $scope.sendPost = function() {
		/* Date Coder begin*/
		if (!$scope.allPeriod) {
			var startCode = date2code(Date.parse($scope.startDate.toString()),'A');
			var endCode = date2code(Date.parse($scope.endDate.toString()),'_');
		}
		/* $scope.latFirst = startCode;
		$scope.latSecond = endCode; */
		/*end */
	
		var coords = {
				"top": $scope.latFirst,
				"right":$scope.latSecond,
				"bottom" :$scope.latThird,
				"left": $scope.latFourth,
				"allPeriod": $scope.allPeriod
			};
		var postUrl = '';
		if ( $scope.allPeriod === false){
			postUrl = "../customer-office/proxy.php";
		} else { postUrl = "../customer-office/proxy-nodate.php"};
		
		$.post( 
			postUrl,
			{ 
				top: coords.top, 
				right: coords.right, 
				bottom: coords.bottom, 
				left: coords.left,
				startDate: startCode,
				endDate: endCode,
				allPeriod: coords.allPeriod
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
						};
						polygonCoords.push(coord);
					}
<<<<<<< HEAD

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
					polygonCreate(imagePolygon[i], polygonCoords);
					addListenersOnPolygon(imagePolygon[i],i);
				}
				/* end */
				var marker = [];
				for(j = 0; j < 10; j++){

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

					  $.post(
					   "../customer-office/imagerotate.php",
					   {
						   qlUrl: images[j].qlUrl,
						   name: images[j].name,
						   north: imageBounds.north,
						   south: imageBounds.south,
						   east: imageBounds.east,
						   west: imageBounds.west
					   }
					  ).done(function(data){
						  var temp;
						  images[j].qlUrl = data[0];
						  var bounds = {
							  north: parseFloat(data[1]),
							  south: parseFloat(data[2]),
							  east: parseFloat(data[3]),
							  west: parseFloat(data[4])
						  };
						  
						  overlayQuicklook = new google.maps.GroundOverlay(
							  images[j].qlUrl,
							  bounds);
						  overlayQuicklook.setMap(map);
					  });
					  

				}
=======
					
					polygonCreate(imagePolygon[i], polygonCoords, images[i].name, images[i].qlUrl, images[i].footprint, images[i].resolution);
					addListenersOnPolygon(imagePolygon[i],i);
				}
				/* end */
>>>>>>> 0ba817688b1048ca276a8f7d5794d7347c4bf53d
				
				$scope.$apply();
				
			});
		
    }                   
}]);

<<<<<<< HEAD

function polygonCreate(polygon, coordinates){
=======
function countArea(polygon){
	return Math.floor(google.maps.geometry.spherical.computeArea(polygon.getPath()) / 1000000);
}

function polygonCreate(polygon, coordinates, name, qlUrl, footprint, resolution){
>>>>>>> 0ba817688b1048ca276a8f7d5794d7347c4bf53d
	imagePolygon[i] = new google.maps.Polygon({
		paths: coordinates,
		strokeColor: '#9933FF',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#9933FF',
		fillOpacity: 0.1,
		name: name,
		qlUrl: qlUrl,
		footprint: footprint,
		resolution: resolution
	});
	var zindex = Math.floor((350000- countArea(imagePolygon[i])) / 1000 );
	console.log(zindex);
	imagePolygon[i].setOptions({zIndex: zindex });
	imagePolygon[i].setMap(map);
}

var addListenersOnPolygon = function(polygon, ind) {
	//listeners
  google.maps.event.addListener(polygon, 'click', function (event) {
	
					  var centerFootprint = centerPoly(footprintEdges(polygon.footprint)[0],footprintEdges(polygon.footprint)[2]); //Находим центр футпринта
					  var centerNorth = centerPoly(footprintEdges(polygon.footprint)[0],footprintEdges(polygon.footprint)[1]); //Находим центр верхнего края
					  var centerWest = centerPoly(footprintEdges(polygon.footprint)[0],footprintEdges(polygon.footprint)[3]); //Находим центр левого края
					  var centerEast = centerPoly(footprintEdges(polygon.footprint)[1],footprintEdges(polygon.footprint)[2]); //Находим центр правого края
					  var centerSouth = centerPoly(footprintEdges(polygon.footprint)[2],footprintEdges(polygon.footprint)[3]); //Находим центр нижнего края
					  
					  var degrees = 0;
					  if (polygon.resolution === 'MR') {
						  var imageBounds = {
							  north: footprintEdges(polygon.footprint)[2][0],
							  south: footprintEdges(polygon.footprint)[0][0],
							  east: footprintEdges(polygon.footprint)[1][1],
							  west: footprintEdges(polygon.footprint)[3][1]
						  };
					  }
					  if (polygon.resolution === 'HR'){
						  var imageBounds = {
							  north: footprintEdges(polygon.footprint)[2][0],
							  south: footprintEdges(polygon.footprint)[0][0],
							  east: footprintEdges(polygon.footprint)[1][1],
							  west: footprintEdges(polygon.footprint)[3][1]
						  };
					  }
					  
					  
					  degrees = -Math.atan((footprintEdges(polygon.footprint)[0][1] - footprintEdges(polygon.footprint)[3][1])/(footprintEdges(polygon.footprint)[0][0] - footprintEdges(polygon.footprint)[3][0]))*180/Math.PI;
					  $.post(
					   "../customer-office/imagerotate.php",
					   {
						   qlUrl: polygon.qlUrl,
						   name: polygon.name,
						   degrees: degrees
					   }
					  ).done(function(data){
						  var temp;
						  polygon.qlUrl = data[0];
						  
						  overlayQuicklook = new google.maps.GroundOverlay(
							  polygon.qlUrl,
							  imageBounds);
						  overlayQuicklook.setMap(map);
					  });
	
	

  });

  google.maps.event.addListener(polygon, 'mouseover', function (event) {
    polygon.setOptions({strokeWeight:4, fillOpacity:0.5, strokeColor: '#00CC66', fillColor: '#00CC66'});
  });
  
  google.maps.event.addListener(polygon, 'mouseout', function (event) {
    polygon.setOptions({strokeWeight:2, fillOpacity:0.1, strokeColor: '#9933FF', fillColor: '#9933FF'});
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
