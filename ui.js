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
