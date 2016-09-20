var trucksData = new TrucksCollection();
var queryPoints = [-122.4193139 ,37.7723856];
var acceptableDistance = .25;
var closeTrucks;

var truckIcon = L.icon({
  iconUrl: 'assets/truck.svg',
  iconSize: [40,40],
  iconAnchor: [20,20]
});

var mymap = L.map('mapid').setView([37.7723856, -122.4193139], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/cit7w6057002s2xmf3idb5i87/tiles/256/{z}/{x}/{y}?access_token={access_token}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    minZoom: 2,
    id: AppConfig.data.mapboxId,
    access_token: AppConfig.data.accessToken
}).addTo(mymap);

$('#distanceControl').change(function(e){
  rangeValue = $('#distanceControl').val();
  $('#distanceValue').text(rangeValue);
  return rangeValue;
});

$('form').submit(function(e){
  e.preventDefault();
  removePins();
  var rangeValue = $('#distanceControl').val();
  var currentLocation =  $('#locationInput').val()+' San Francisco, Ca';
  var currentLatLong = getAddress(googleGeocoder, currentLocation);
  var closeTrucks = filterCloseTrucks(currentLatLong,rangeValue);
  window.closeTrucks = closeTrucks;
  return {currentLatLong: currentLatLong,rangeValue: rangeValue, closeTrucks: closeTrucks};
});

$('#controller').click(function(e){
  $controlPanel = $(e.target).parent();

  if($controlPanel.hasClass('open')){
    $controlPanel.removeClass('open');
    $controlPanel.addClass('closed');
    $(e.target).text("[>]");
    return;
  }
  if($controlPanel.hasClass('closed')){
    $controlPanel.removeClass('closed').addClass('open');
    $(e.target).text('[x]');
    return;
  }
});

$(document).ready(function(){
  trucksData.fetch().then(function() {
    var closeTrucks = filterCloseTrucks(queryPoints,acceptableDistance);
    dropPinsForTrucks(closeTrucks);
  });
});
