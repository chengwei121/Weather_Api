// API key for WeatherAPI.com
const API_KEY = 'f90c3a2ef6fe49618d410655242811';

// Wait for the DOM (Document Object Model) to be fully loaded before executing
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const searchBtn = document.getElementById('search');
    const cityInput = document.getElementById('city');
    const dateElement = document.getElementById('date');

    // Initialize the date display
    updateDate();

    // Set up event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Update the date display every minute
    setInterval(updateDate, 60000);
});

// Function to update the date display
function updateDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();
    const options = {
        // Display the full name of the day of the week (e.g., "Monday")
        weekday: 'long', 
        // Display the year as a full numeric value (e.g., "2023")
        year: 'numeric', 
        // Display the full name of the month (e.g., "November")
        month: 'long', 
        // Display the day of the month as a number (e.g., "27")
        day: 'numeric',
        // Display hours in 2-digit format (e.g., "09" or "23")
        hour: '2-digit',
        // Display minutes in 2-digit format (e.g., "05" or "59")
        minute: '2-digit'
    };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Function to handle the search action
function handleSearch() {
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();
    
    if (city) {
        showLoading();
        fetchWeather(city);
    } else {
        showError('Please enter a city name');
    }
}

// Async function to fetch weather data from the API
async function fetchWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateUI(data);
            hideLoading();
        } else {
            showError(data.error.message);
            hideLoading();
        }
    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
        hideLoading();
    }
}

// Function to update the UI with fetched weather data
function updateUI(data) {
    // Update main weather information
    document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById('temp').textContent = Math.round(data.current.temp_c);
    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('weather-icon').src = data.current.condition.icon;

    // Update weather stats
    document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('cloud').textContent = `${data.current.cloud}%`;
    document.getElementById('visibility').textContent = `${data.current.vis_km} km`;
    
    // Update additional information
    document.getElementById('uv').textContent = data.current.uv;
    document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°C`;
    document.getElementById('wind-dir').textContent = data.current.wind_dir;

    // Add fade-in animation to updated elements
    const elements = document.querySelectorAll('.weather-stat-card, .info-card');
    elements.forEach(element => {
        element.classList.remove('fade-in');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('fade-in');
    });
}

// Function to show the loading overlay
function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'flex';
}

// Function to hide the loading overlay
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'none';
}

// Function to display error messages as a toast notification
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast to document
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Add CSS for the toast notification
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
// Append the style to the document head
document.head.appendChild(style);