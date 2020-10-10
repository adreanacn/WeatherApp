// Go to this URL and register https://openweathermap.org/appid
// Get your API KEY (appid)

const APIkey = "388a4376d8724a90c940fdb39099d740";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?";

const onSuccess = position => {


    const {
        coords: { latitude, longitude } }
        = position;

    callWeather(latitude, longitude);
};



const onError = error => {
    console.error(error.message);
    const notification = document.createElement("p");
    notification.innerText = error.message;

    const divNotification = document.getElementsByClassName("notification")[0];
    divNotification.style.display = "block";

    divNotification.appendChild(notification);
};

const convertKelvintoCelsius = kelvin => Math.round(kelvin - 273.15);

const showWeatherInfo = info => {
    const {
        main: { temp },
        name,
        sys: { country },
        weather: [{ description, icon }]
    } = info;


    console.log("info que necesito", convertKelvintoCelsius(temp), name, country, description, icon);
    const iconElement = document.getElementsByClassName("icon");
    iconElement.src = `icons/${icon}.png`;
};

const callWeather = (latitude, longitude) => {
    const call = fetch(`${baseURL}lat=${latitude}&lon=${longitude}&appid=${APIkey}`);

    call.then(response => response.json()).then(weatherInfo => showWeatherInfo(weatherInfo));
    call.catch(error => console.error(error));
};

navigator.geolocation.getCurrentPosition(onSuccess, onError);
// fetch(URL).then(onSuccess()).catch(onError());