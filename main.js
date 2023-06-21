class WeatherData {
  constructor(name, icon, description, temp, humidity, wind) {
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
  }
}

class Weather {
  constructor(apiKey, timeZoneApiKey) {
    this.apiKey = apiKey;
    this.timeZoneApiKey = timeZoneApiKey;
  }

  fetchWeather(city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          this.showError("No weather found");
          throw new Error("No weather found.");
        } else {
          this.hideError();
        }
        return response.json();
      })
      .then((data) => {
        const weatherData = this.extractWeatherData(data);
        this.fetchLocalTime(data.coord.lat, data.coord.lon);
        this.displayWeather(weatherData);
      });
  }

  extractWeatherData(data) {
    const name = data.name;
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    return new WeatherData(name, icon, description, temp, humidity, wind);
  }

  fetchLocalTime(latitude, longitude) {
    fetch(
      "https://api.timezonedb.com/v2.1/get-time-zone?key=" +
        this.timeZoneApiKey +
        "&format=json&by=position&lat=" +
        latitude +
        "&lng=" +
        longitude
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch local time.");
        }
        return response.json();
      })
      .then((timeData) => {
        const { formatted } = timeData;
        const localTime = moment(formatted).format("MMMM Do YYYY, h:mm:ss a");
        document.querySelector(".local-time").innerText = "Local Time: " + localTime;
      })
      .catch((error) => {
        console.log("Error fetching local time:", error);
      });
  }

  displayWeather(data) {
    const { name, icon, description, temp, humidity, wind } = data;
    const currentDate = moment().format("MMMM Do YYYY, h:mm:ss a");

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + wind + " km/h";
    document.querySelector(".current-date").innerText = "Current Date: " + currentDate;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
  }

  showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-message').style.display = 'block';

    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        new Notification('Error', {
          body: message
        });
      }
    });
  }

  hideError() {
    document.getElementById('error-message').style.display = 'none';
  }

  search() {
    const searchInput = document.querySelector(".search-bar").value;
    if (searchInput.trim() !== "") {
      this.fetchWeather(searchInput);
    }
  }
}

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

const weatherApiKey = "817bf36acf2fb1d245740aa1398211d1";
const timeZoneApiKey = "2RNQLAALCDM7";
const weather = new Weather(weatherApiKey, timeZoneApiKey);

weather.fetchWeather("Denver");
