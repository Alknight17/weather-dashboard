// API key from openweather 6b388d2d923733b00f9b381eb173ff19
var API ="6b388d2d923733b00f9b381eb173ff19";

// define variables for various weather elements
var citySearch = document.getElementById("city-input");
var cityName = document.getElementById("locate-city");
var searchBtn = document.getElementById("search");
var currentWeather = document.getElementById("current-weather");
var futureForecast = document.getElementById("future-forecast");
var currentTemp = document.getElementById("temp");
var currentHumidity = document.getElementById('humid');
var currentWind = document.getElementById("wind");
var currentUV = document.getElementById("UV");



// use weather API to find searched city's weather
 function findWeather (city) {
     let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API;
    axios.get(queryURL).then(function (response ) {
        currentWeather.remove('hide');

        // show current date next to city 
        cityName.innerHTML = moment().format("dddd MMMM Mo YYYY");
    })
 }

findWeather();
