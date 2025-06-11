const weatherInfo = document.getElementById('weather-info');
const API_KEY = 'd757120bf8494fd9e1efeb6bb4807335'; //

function updateClock() {
  const now = new Date();

  // Format time as HH:MM:SS
  const time = now.toLocaleTimeString('en-US', { hour12: false });

  // Format date as Weekday, Month Day, Year
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById('time').textContent = time;
  document.getElementById('date').textContent = date;
}

function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Weather data not available');
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp.toFixed(1);
      const condition = data.weather[0].description;
      const city = data.name;
      weatherInfo.textContent = `${city}: ${temp}°C, ${capitalize(condition)}`;
    })
    .catch(() => {
      weatherInfo.textContent = 'Unable to fetch weather.';
    });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function requestWeather() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        weatherInfo.textContent = 'Geolocation permission denied.';
      }
    );
  } else {
    weatherInfo.textContent = 'Geolocation not supported.';
  }
}

// Initial calls
updateClock();
setInterval(updateClock, 1000);
requestWeather();
