
// create function that receives city search input, and turns searched cities into clickable buttons
function cityList(citySearchList) {
    $("#city-list").empty();
  
    var keys = Object.keys(citySearchList);
    for (var i = 0; i < keys.length; i++) {
      var cityListEntry = $("<button>");
      cityListEntry.addClass("list-group-item list-group-item-action");
  
      var splitStr = keys[i].toLowerCase().split(" ");
      for (var j = 0; j < splitStr.length; j++) {
        splitStr[j] = splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
      }

      var titleCasedCity = splitStr.join(" ");
      cityListEntry.text(titleCasedCity);
  
      $("#city-list").append(cityListEntry);
    }
  }

  // global variable for API key
  var apiKey = "6b388d2d923733b00f9b381eb173ff19"
  
  // create function to search for city and extract api data
  function CityWeather(city, citySearchList) {
    cityList(citySearchList);
  
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
  
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
  
    // define lat/lon as variables to use in weather api
    var latitude;
    var longitude;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    })

      // create an object called weather to store api data
      .then(function(weather) {
  
        var nowMoment = moment();
  
        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")"));
  
        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);
  
        var weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png");

        // use jquery to pull icons from weather api
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
  
        // use jquery to pull various weather statuses 
        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
  
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?q=" + city + "&appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;
  
        $.ajax({
          url: queryURL3,
          method: "GET"
          // Store all of the retrieved data inside of an object called "uvIndex"
        }).then(function(uvIndex) {
          console.log(uvIndex);
  
          var uvIndexDisplay = $("<button>");
          uvIndexDisplay.addClass("btn btn-danger");
  
          $("#current-uv").text("UV Index: ");
          $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
          console.log(uvIndex[0].value);
  
          $.ajax({
            url: queryURL2,
            method: "GET"
            // Store all of the retrieved data inside of an object called "forecast"
          }).then(function(forecast) {
            console.log(queryURL2);
  
            console.log(forecast);
            // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
            for (var i = 6; i < forecast.list.length; i += 8) {
              var forecastDate = $("<h5>");
  
              var forecastPosition = (i + 2) / 8;
  
              console.log("#forecast-date" + forecastPosition);
  
              $("#forecast-date" + forecastPosition).empty();
              $("#forecast-date" + forecastPosition).append(forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY")));
  
              var forecastIcon = $("<img>");
              forecastIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" +
                  forecast.list[i].weather[0].icon +
                  ".png"
              );
  
              $("#forecast-icon" + forecastPosition).empty();
              $("#forecast-icon" + forecastPosition).append(forecastIcon);
  
              $("#forecast-temp" + forecastPosition).text("Temp: " + forecast.list[i].main.temp + " °F");

              $("#forecast-humidity" + forecastPosition).text("Humidity: " + forecast.list[i].main.humidity + "%");


              $("#forecast-wind" + forecastPosition).text("Wind: " + forecast.list[i].wind.speed + " MPH");
  
            }
          });
        });
      });
  }
  
  $(document).ready(function() {
    var citySearchListStringified = localStorage.getItem("citySearchList");
  
    var citySearchList = JSON.parse(citySearchListStringified);
  
    if (citySearchList == null) {
      citySearchList = {};
    }
  
    cityList(citySearchList);
  
    $("#current-weather").hide();
    $("#forecast-weather").hide();
  
  
  
    $("#search-button").on("click", function(event) {
      event.preventDefault();
      var city = $("#city-input")
        .val()
        .trim()
        .toLowerCase();
  
      if (city != "") {
      
      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
  
      CityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
      }
  
      
    });
  
    $("#city-list").on("click", "button", function(event) {
      event.preventDefault();
      var city = $(this).text();
  
      CityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
    });
  });