const apiKey = 'r4FJX0isD2ab2GMveGDWyvpRHtrfk9Vf'; // Reemplaza con tu clave de API de AccuWeather

// Obtener datos del clima

function getWeatherData(city) {
  const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const locationKey = data[0].Key;
      console.log(data);
      console.log(locationKey);
      return fetch(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`);
    })
    .then(response => response.json())
    .then(data => {
      const currentWeather = data[0];
      console.log(currentWeather);
      displayWeather(currentWeather); 
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// getWeatherData('miami');

// Mostrar datos del clima en el DOM
function displayWeather(weather) {
  const locationElement = document.getElementById('location');
  const currentWeatherElement = document.getElementById('current-weather');

  console.log(locationElement);
  console.log(currentWeatherElement);

  locationElement.textContent = `Ubicación: ${weather[0].LocalizedName}, ${weather[0].Country.LocalizedName}`;
  currentWeatherElement.textContent = `Clima actual: ${weather[0].WeatherText}, ${weather[0].Temperature.Metric.Value}°${weather[0].Temperature.Metric.Unit}`;
}

// Manejar el evento de envío del formulario
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('city-input').value;
  getWeatherData(city);
});
