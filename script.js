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

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);
.weather {
  margin-top: 2rem;
  border-top: 1px solid #00ff99;
  padding-top: 1rem;
  text-align: center;
}

#weather-info {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  min-height: 40px;
}
