$(document).ready(function(){
  $('#settingsForm').on('submit', function(e){
    let settings = {
      city: $('#city').val(),
      state: $('#state').val()
    }

    // Save
    saveSettings(settings);

    e.preventDefault();
  });
});

$(document).on('pagebeforeshow', '#home', function(){
  getWeather();
});

$(document).on('pagebeforeshow', '#settings', function(){
  $('#city').val(getLocation().city);
  $('#state').val(getLocation().state);
});

function getWeather(){
  let location = getLocation();

  let city = location.city;
  let state = location.state;

  $.ajax({
    url:'http://api.wunderground.com/api/b711a61d20dc3abb/conditions/q/'+state+'/'+city+'.json'
  }).done(function(response){
    let weather = response.current_observation;

    let weatherTop = `
      <img src="${weather.icon_url}">
      <h1>${weather.temp_f} F</h1>
      <h2>${weather.display_location.full}</h2>
    `;

    $('#weatherTop').html(weatherTop);

    let weatherList = `
      <li><strong>Weather: </strong>${weather.weather}</li>
      <li><strong>Temp: </strong>${weather.temperature_string}</li>
      <li><strong>Dewpoint: </strong>${weather.dewpoint_string}</li>
      <li><strong>Relative Humidity: </strong>${weather.relative_humidity}</li>
      <li><strong>Windchill: </strong>${weather.windchill_string}</li>
      <li><strong>Visibility: </strong>${weather.visibility_mi} Miles</li>
    `;

    $('#weatherList').html(weatherList).listview('refresh');
  })
}

function getLocation(){
  let location;
  if(localStorage.getItem('location') === null){
    location = {city:'Boston', state:'MA'};
  } else {
    location = JSON.parse(localStorage.getItem('location'));
  }

  return location;
}

function saveSettings(settings){
  if(settings.city == '' || settings.state == ''){
    alert('Please fill in all fields');
  } else {
    let location = {
      city:settings.city,
      state: settings.state
    }

    localStorage.setItem('location', JSON.stringify(location));
    $.mobile.changePage('#home');
  }
}
