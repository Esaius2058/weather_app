/* eslint-disable no-undef */
import "./styles.css";
document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById("location-input");
    const weatherInfoBox = document.getElementById("weather-info");
    const locationAddress = document.getElementById("location-address");
    const currentDate = document.getElementById("current-date");
    const currentConditions = document.getElementById("current-conditions");
    const tempElement = document.getElementById("temp-element");
    const precipitationType = document.getElementById("precipitation-type");
    const precipitationProbability = document.getElementById("precipitation-probability");
    const weatherDescription = document.getElementById("weather-description");
    const sunriseTime = document.getElementById("sun-rise");
    const sunsetTime = document.getElementById("sun-set");
    const searchBtn = document.getElementById("search-button");
    const toggleBtn = document.getElementById("toggle-btn");

    let currentTempInCelsius = null;
    let isHidden = true;

    // Fetch weather data
    const fetchWeatherData = async (location) => {
        const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=XN7TAB4GUC2PMJZRMJ7A6ULZ3&contentType=json`;
        try {
            const response = await fetch(weatherUrl, { mode: 'cors' });
            return await response.json();
        } catch (err) {
            throw new Error('Failed to fetch weather data');
        }
    };

    // Render weather data to the DOM
    const renderWeatherData = (data) => {
        const address = data.resolvedAddress;
        const date = data.days[0].datetime;
        const conditions = data.days[0].conditions;
        currentTempInCelsius = data.currentConditions.temp;
        const precipProb = data.days[0].precipprob ?? '0';
        const precipType = data.days[0].preciptype ?? 'No precipitation';
        const description = data.days[0].description;
        const sunRise = data.days[0].sunrise;
        const sunSet = data.days[0].sunset;

        locationAddress.innerText = `Location Address: ${address}`;
        currentDate.innerText = `Current Date: ${date}`;
        currentConditions.innerText = `Current Conditions: ${conditions}`;
        tempElement.innerHTML = `Temperature: ${currentTempInCelsius}&deg;C`;
        precipitationType.innerText = `Precipitation Type: ${precipType}`;
        precipitationProbability.innerText = `Probability of ${precipType}ing: ${precipProb}%`;
        weatherDescription.innerText = `Description: ${description}`;
        sunriseTime.innerText = `Sunrise: ${sunRise}`;
        sunsetTime.innerText = `Sunset: ${sunSet}`;
    };

    // Temperature conversion
    const convertTemperature = (tempCelsius, toFahrenheit) => {
        return toFahrenheit ? (tempCelsius * 9 / 5) + 32 : tempCelsius;
    };

    const updateTemperature = (isFahrenheit) => {
        if (currentTempInCelsius !== null) {
            const temperature = convertTemperature(currentTempInCelsius, isFahrenheit);
            tempElement.innerHTML = `Temperature: ${temperature.toFixed(1)}&deg;${isFahrenheit ? 'F' : 'C'}`;
        }
    };

    // Handle search button click
    const handleSearch = async () => {
        const location = locationInput.value.toLowerCase();
        try {
            const weatherData = await fetchWeatherData(location);
            renderWeatherData(weatherData);
            if (isHidden) {
                weatherInfoBox.classList.toggle('hidden');
                isHidden = false;
            }
        } catch (err) {
            weatherInfoBox.innerHTML = `<p>Error: ${err.message}</p>`;
        }
        locationInput.value = '';
    };

    // Handle toggle button click for temperature unit change
    const handleToggle = () => {
        const isFahrenheit = toggleBtn.value === 'Fahrenheit';
        toggleBtn.value = isFahrenheit ? 'Degrees' : 'Fahrenheit';
        toggleBtn.innerHTML = isFahrenheit ? '&#8457;' : '&deg;C';
        updateTemperature(!isFahrenheit);
    };

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    toggleBtn.addEventListener('click', handleToggle);
});
