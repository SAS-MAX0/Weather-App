const container = document.querySelector('.container');
const searchButton = document.querySelector('.searchbox button');
const searchInput = document.querySelector('.searchbox input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

// Array of background images for the body element
const backgroundImages = [
    "images/background1.jpg",
    "images/background2.jpg",
    "images/background3.jpg"
];

// Function to cycle through background images on the body
let currentBackgroundIndex = 0;

const cycleBackgroundImages = () => {
    const body = document.body;
    body.classList.add('fade-out'); // Add fade-out class

    setTimeout(() => {
        // Change the background image after fade out
        body.style.background = `url('${backgroundImages[currentBackgroundIndex]}')`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';

        body.classList.remove('fade-out'); // Remove fade-out class
        body.classList.add('fade-in'); // Add fade-in class

        // Update index to show the next image, looping back to the start
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;

        // Remove fade-in class after the transition
        setTimeout(() => {
            body.classList.remove('fade-in');
        }, 1000); // Duration of the fade-in effect
    }, 1000); // Duration of the fade-out effect
};

// Start cycling backgrounds every 5 seconds (5000 ms)
setInterval(cycleBackgroundImages, 5000);

// Function to perform the search and display weather data
const performSearch = () => {
    const APIKey = '23bc7eda0ac12613245e2ee41a5b8c8a'; // Your OpenWeatherMap API Key
    const city = searchInput.value.trim(); // Get the input value

    if (city === '') {
        return; // Exit if the input is empty
    }

    // Fetch weather data from the OpenWeatherMap API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            if (json.cod === '404') {
                // City not found, display 404 image and message
                image.src = 'images/404.png';
                temperature.innerHTML = '';
                description.innerHTML = 'City not found';
                humidity.innerHTML = '';
                wind.innerHTML = '';
                container.style.height = '200px'; // Adjust height for error state
                return;
            }

            // Set the weather icon based on weather conditions
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Clouds':
                case 'Haze':
                case 'Fog':
                    image.src = 'images/cloud.png';
                    break;
                case 'Mist':
                    image.src = 'images/mist.png';
                    break;
                case 'Rain':
                case 'Drizzle':
                case 'Thunderstorm':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                default:
                    image.src = 'images/cloud.png';
            }

            // Update the weather details in the HTML
            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${Math.round(json.wind.speed)} Km/h`;

            // Expand the container to show weather details
            container.classList.add('expanded'); // Add a class to expand the container
            weatherBox.style.display = 'flex';
            weatherDetails.classList.add('show');
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
};

// Event listener for search button click
searchButton.addEventListener('click', performSearch);

// Event listener for Enter key press
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch(); // Call the search function when Enter is pressed
    }
});
