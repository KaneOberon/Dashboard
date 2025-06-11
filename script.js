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
const quotes = [
  {
    text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    source: "Isaiah 40:31"
  },
  {
    text: "The LORD is my shepherd, I lack nothing.",
    source: "Psalm 23:1"
  },
  {
    text: "I can do all this through him who gives me strength.",
    source: "Philippians 4:13"
  },
  {
    text: "Trust in the LORD with all your heart and lean not on your own understanding;",
    source: "Proverbs 3:5"
  }
];

function showQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  const quote = quotes[idx];
  document.getElementById('quote-text').textContent = quote.text;
  document.getElementById('quote-source').textContent = quote.source;
}

showQuote();
function updateBatteryStatus(battery) {
  const level = Math.round(battery.level * 100);
  const charging = battery.charging ? ' (Charging)' : '';
  document.getElementById('battery-status').textContent = `Battery: ${level}%${charging}`;
}

function updateNetworkStatus() {
  const status = navigator.onLine ? 'Online' : 'Offline';
  document.getElementById('network-status').textContent = `Network: ${status}`;
}

if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    updateBatteryStatus(battery);
    battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
    battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
  }).catch(() => {
    document.getElementById('battery-status').textContent = 'Battery info not available.';
  });
} else {
  document.getElementById('battery-status').textContent = 'Battery info not supported.';
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Initial network status update
updateNetworkStatus();
const newsList = document.getElementById('news-list');
const RSS_URL = 'https://feeds.bbci.co.uk/news/world/europe/rss.xml';

fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    let ukraineNews = [];
    items.forEach(item => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      if (title.toLowerCase().includes('ukraine') || 
          (item.querySelector('description')?.textContent.toLowerCase().includes('ukraine'))) {
        ukraineNews.push({ title, link });
      }
    });

    newsList.innerHTML = '';
    if (ukraineNews.length === 0) {
      newsList.innerHTML = '<li>No Ukraine news found.</li>';
      return;
    }

    ukraineNews.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>`;
      newsList.appendChild(li);
    });
  })
  .catch(() => {
    newsList.innerHTML = '<li>Unable to fetch news.</li>';
  });

// Initial calls
updateClock();
setInterval(updateClock, 1000);
requestWeather();
