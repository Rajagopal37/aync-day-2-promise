let container = document.createElement("div");
container.setAttribute("class","container");
document.body.append(container);

let row = document.createElement('div');
row.setAttribute("class","row");
row.setAttribute("id","country-cards");
container.append(row);


document.addEventListener('DOMContentLoaded', () => {
    const countryCardsContainer = document.getElementById('country-cards');

    // Fetch country data from the REST Countries API
    fetch('https://restcountries.com/v3.1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(countries => {
            countries.forEach( country => {
                const lat = country.latlng ? country.latlng[0] : '';
                const lon = country.latlng ? country.latlng[1] : '';

                // Create a column for each country
                const card = document.createElement('div');
                card.className = 'col-lg-4 col-sm-12 my-2';

                // Create the inner content for the card
                const cardInner = `
                    <div class="card">
                        <div class="card-header">
                            <h5>${country.name.common}</h5>
                        </div>
                        <div class="card-body">
                            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="card-img-top">
                            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                            <p><strong>Region:</strong> ${country.region}</p>
                            <p><strong>Latitude and Longitude:</strong> ${country.latlng ? country.latlng.join(', ') : 'N/A'}</p>
                            <p><strong>Country Code:</strong> ${country.cca2}</p>
                            <button class="btn btn-primary" onclick="getWeather('${lat}', '${lon}', '${country.name.common}')">Click for Weather</button>
                        </div>
                    </div>
                `;
                card.innerHTML = cardInner;
                countryCardsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching country data:', error));

    // Function to fetch weather data and display it
    window.getWeather = (lat, lon, countryName) => {
        console.log(`Fetching weather for ${countryName} at lat: ${lat}, lon: ${lon}`);

        if (!lat || !lon) {
            alert(`No weather data available for ${countryName}`);
            return;
        }

        const apiKey = 'f725627bcf5fd1d1531cd7535a0486cd';
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data fetch failed');
                }
                return response.json();
            })
            .then(weather => {
                console.log('Weather data:', weather);
                alert(`Current weather in ${countryName}: ${weather.weather[0].description}, Temperature: ${(weather.main.temp - 273.15).toFixed(2)}°C`);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    };
});

