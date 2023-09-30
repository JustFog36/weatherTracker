$(document).ready(function() {
    // Display the current date at the top of the page
    var currentDay = dayjs().format("(MM/DD/YYYY)");
    $("#currentDay").text(currentDay);
})
    
    document.addEventListener('DOMContentLoaded', function () {
        const apiKey = '224e83465741afab2bc1f17f721eba71';
        const cityForm = document.getElementById('cityForm');
        const cityInput = document.getElementById('cityInput');
        const searchHistory = document.getElementById('searchHistory');
        const currentWeather = document.getElementById('currentWeather');
        const forecast = document.getElementById('forecast');
    
        // Load search history from localStorage
        var searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
        // Function to save search history to localStorage
        function saveSearchHistory(city) {
            searchHistoryData.unshift(city);

            if (searchHistoryData.length > 8) {
                searchHistoryData=searchHistoryData.slice(0,8)
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
        }
    
        // Function to display search history
        function displaySearchHistory() {
            searchHistory.innerHTML = '';
            const recentSearches = searchHistoryData.slice(0, 8); 
            searchHistoryData.forEach(city => {
                const historyItem = document.createElement('div');
                historyItem.textContent = city;
                historyItem.classList.add('history-item');
                historyItem.addEventListener('click', () => {
                    getWeather(city);
                });
                searchHistory.appendChild(historyItem);
            });
        }
    
        // Function to get weather data from OpenWeatherMap API
        async function getWeather(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=5&appid=${apiKey}&units=imperial`);
                const data = await response.json();

                // Display current weather
                cityWorld.textContent = `${data.name} (${new Date().toLocaleDateString()})`
                cityTemp.textContent = `Temperature: ${data.main.temp}°F`
                cityWind.textContent = `Wind Speed: ${(data.wind.speed).toFixed(2)} mph`
                cityHumidity.textContent = `Humidity: ${data.main.humidity}%`
    
                // Save search history and display it
                saveSearchHistory(data.name);
                displaySearchHistory();
    
                // Get 5-day forecast
                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
                const forecastData = await forecastResponse.json();
    
                // Display 5-day forecast
                forecast.innerHTML = '';
                const forecastContainer = document.createElement('div'); // Create a container
                forecastContainer.classList.add('forecast-container');
                forecast.appendChild(forecastContainer);
                
                for (let i = 0; i < 5; i++) {
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
                        <h3>${new Date(forecastData.list[i*8].dt_txt).toLocaleDateString()}</h3>
                        <p>${mapWeatherIconToEmoji(forecastData.list[i].weather[0].icon)}</p>                        <p>Temperature: ${forecastData.list[i].main.temp}°F</p>
                        <p>Humidity: ${forecastData.list[i].main.humidity}%</p>
                        <p>Wind Speed: ${forecastData.list[i].wind.speed} mph</p>
                    `;
                    forecast.appendChild(forecastItem);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
    
        // Event listener for the city form submission
        cityForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
                cityInput.value = '';
            }
        });
    
        // Initial display of search history
        displaySearchHistory();
    });0

    function mapWeatherIconToEmoji(iconCode) {
        switch (iconCode) {
            case '01d':
                return '☀️'; // Clear sky (day)
            case '01n':
                return '🌙'; // Clear sky (night)
            case '02d':
                return '⛅'; // Few clouds (day)
            case '02n':
                return '🌥️'; // Few clouds (night)
            case '03d':
            case '03n':
                return '☁️'; // Scattered clouds
            case '04d':
            case '04n':
                return '☁️'; // Broken clouds
            case '09d':
            case '09n':
                return '🌧️'; // Rain
            case '10d':
                return '🌦️'; // Rain (day)
            case '10n':
                return '🌧️'; // Rain (night)
            case '11d':
            case '11n':
                return '⛈️'; // Thunderstorm
            case '13d':
            case '13n':
                return '❄️'; // Snow
            case '50d':
            case '50n':
                return '🌫️'; // Mist/Fog
            default:
                return '❓'; // Unknown icon
        }
    }