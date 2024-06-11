

const apiKey = '99578f24910d157c10cde6c280b61a4f';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const weatherDiv = document.getElementById('weather');
const historyList = document.getElementById('history');

// Load search history from local storage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
updateHistoryUI();

// Add event listener to the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
        saveToHistory(city);
        updateHistoryUI();
    }
});


async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    const data = await response.json();
    displayWeather(data);
}

// Display weather data on the web page
function displayWeather(data) {
    weatherDiv.innerHTML = '';
    if (data.cod !== '200') {
        weatherDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    for (let i = 0; i < data.list.length; i += 8) { 
        const dayData = data.list[i];
        const date = new Date(dayData.dt_txt).toLocaleDateString();
        const temp = dayData.main.temp;
        const description = dayData.weather[0].description;
        const icon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

        weatherDiv.innerHTML += `
            <div class="day">
                <h3>${date}</h3>
                <p><img src="${icon}" alt="${description}"></p>
                <p>Temperature: ${temp} °F</p>
                <p>${description}</p>
            </div>
        `;
    }
}

// Save search to local storage
function saveToHistory(city) {
    searchHistory = searchHistory.filter(c => c !== city);
    searchHistory.unshift(city);
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Update search history UI
function updateHistoryUI() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            getWeather(city);
        });
        historyList.appendChild(li);
    });
}