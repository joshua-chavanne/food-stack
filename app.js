var truckEndpoint = 'https://data.sfgov.org/resource/6a9r-agq8.json';
var googleGeocoder = 'https://maps.google.com/maps/api/geocode/json?address=';

var AppObj = function AppObj(){
  AppObj = AppObj || {};
  AppObj.data = {
    trucksData : {},
    state : {
      markers: [],
      rangeValue: 0.25,
      currentLocation: null,
      currentLatLong: [-122.4193139 ,37.7723856],
      closeTrucks : [],
    }
  };
  return AppObj;
}();

// http://www.geodatasource.com/developers/javascript
var distance = function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist;
}

var flipLatLon = function flipLatLon(arr){
  var flipCoords = arr;
  var newArr = [];
  newArr.push(flipCoords[1]);
  newArr.push(flipCoords[0]);
  return newArr;
}

var getDotw =  function getDotw(){
  return ['Mo','Tu','We','Th','Fr','Sa','Su'];
}

var semicolonsToBreaks = function semicolonsToBreaks(str){
  var exp = /;/gi;
  return str.replace(exp,'<br />');
};

var spaceColon = function spaceColon(str){
  var exp = /:/gi;
  return str.replace(exp,': ');
}

var removeHours = function removeHours(str){
  return str.split(':')[0];
}

var getDayFromLine = function getDayFromLine(str){
  return removeHours(str);
}

var getDaysByRange = function getDaysByRange(str){
  var dotw = getDotw(),daysOpen = [],splitStr,firstDay,
  lastDay,indexFirst,indexLast;

  str = removeHours(str);
  splitStr = str.split('-');
  firstDay = splitStr[0];
  lastDay = splitStr[1];
  indexFirst = dotw.indexOf(firstDay);
  indexLast = dotw.indexOf(lastDay);
  for(var i = indexFirst; i <= indexLast; i++){
    daysOpen.push(dotw[i]);
  }
  return daysOpen;
};

var daysSemiDelimited = function daysSemiDelimited(str,openDays){
  lines = str.split(';');
  _.map(lines,function(line){
    if(line.indexOf('-')!==-1&&(line.indexOf('-')<line.indexOf(':'))){
      openDays = openDays.concat(getDaysByRange(line));
    }
    else{
      openDays.push(getDayFromLine(line));
    }
  });
  return openDays;
}

var daysSlashDelimited = function daysSlashDelimited(str,openDays){
  //to be implemented
  var tmpArr = [];
  return openDays;
}

var daysOpen = function daysOpen(str){
  var openDays = [], lines;

  if(str.indexOf(';')!==-1&&str.indexOf('/')===-1){
    openDays = daysSemiDelimited(str,openDays);
  }
  if(str.indexOf('/')!==-1&&str.indexOf(';')===-1){
    // to be implemented
    openDays = daysSlashDelimited(str,openDays);
  }
  //to implement SemiColon and Slash Delimited Fields

  return openDays;
};

var truckOpenDayFormatter = function truckOpenDayFormatter(str){
  if(str.indexOf(';')>-1){
    str = semicolonsToBreaks(str);
  }
  if(str.indexOf(':')>-1){
    str = spaceColon(str);
  }
  return str;
};

// Truck Specific Functionality

var TrucksModel = Backbone.Model.extend({
  defaults: {
    address: null,
    applicant: null,
    location: {
      type: "Point",
      coordinates: [
        null,
        null
      ]
    },
  }
});

var TrucksCollection = Backbone.Collection.extend({
  url: truckEndpoint,
  model: TrucksModel,
  parse: function(data){
    return data;
  }
});


var findClosestCoords = function findClosestCoords( data, coords){
  var long1 = data.location.coordinates[0];
  var lat1 = data.location.coordinates[1];
  var long2 = coords[0];
  var lat2 = coords[1];
  return distance(long1,lat1,long2,lat2,'M');
}

function filterCloseTrucks(queryPoints,acceptableDistance){
  var closeTrucks = [];
  _.mapObject(AppObj.data.trucksData.models,function(val,key){
    var thisTruck = val.attributes;
    truckDistance = findClosestCoords(thisTruck,AppObj.data.state.currentLatLong);
    if(truckDistance < acceptableDistance && thisTruck.status === "APPROVED"){
      thisTruck.distance = truckDistance;
      closeTrucks.push(val);
    }
  });
  if(AppObj){
    AppObj.data.state.closeTrucks = closeTrucks;
  }
  return closeTrucks;
}

function exportData(data){
  return currentLatLong = data;
}

function getAddress(googleGeocoder,locationToPass){
  //console.log(googleGeocoder+locationToPass);
  $.ajax({
    url: googleGeocoder+locationToPass,
    success: function(data,status, xhr){
      exportData(data.results[0].geometry.location);
      //console.log(data.results[0].geometry.location);
    }
  }).done(function(data){
    updateLocationLatLongUI(currentLatLong);
    if(mymap){
      //mymap.removeLayer(marker);
      dropPinsForTrucks(AppObj.data.state.closeTrucks);
    }

  });
}

var updateLocationLatLongUI = function updateLocationLatLongUI(currentLatLong){
  if(AppObj.data.state.debug){
    $('#locationLatLong span').text(currentLatLong.lng+' '+currentLatLong.lat);
  }
  if(mymap&&currentLatLong){
    mymap.panTo([currentLatLong.lat,currentLatLong.lng], 16);
  }
};

// refactor to check if need be removed but for now delete all.
var removePins = function removePins(){
  if(AppObj.data.state.markers){
    _.map(AppObj.data.state.markers,function(val){
      mymap.removeLayer(val);
    });
  }
};

var dropPinsForTrucks = function dropPinsForTrucks(closeTrucks){
  var markersUpdated = [];
   if(closeTrucks.length>50){
     alert('Many results please wait.');
   }
  _.mapObject(closeTrucks,function(val,key){
    var markerId = val.cid, attr = val.attributes,
       coords = attr.location.coordinates,
       fooditems = attr.fooditems,
       applicant = attr.applicant, locDesc = ((attr.locationdescription) ? attr.locationdescription : ''),
       days = ((attr.dayshours) ? attr.dayshours : 'Schedule unavailable');
       if(days) days = truckOpenDayFormatter(days);
    markerId = L.marker(flipLatLon(coords)).addTo(mymap);
    markerId.bindPopup('<strong>'+applicant+'</strong><br />'+fooditems+'<hr />'+locDesc+'<br />'+days);
    AppObj.data.state.markers.push(markerId);
  });
}
