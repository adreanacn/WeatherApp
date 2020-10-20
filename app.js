// Go to this URL and register https://openweathermap.org/appid
// Get your API KEY (appid)

const APIkey = "388a4376d8724a90c940fdb39099d740";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?";
const mapboxglAccessToken = "pk.eyJ1IjoiYWRyZWFuYWNuIiwiYSI6ImNrZ2RtM3pxMjBrYWgycmxlanM5bzkxZDcifQ.0rE9L5Qm1pCSYLh7QI4JHQ";
let map;

const createMarker = (longitude, latitude) => new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

const createMap = (latitude, longitude) => {
    const mapDiv = document.getElementById("map");
    mapDiv.style.width = "500px";
    mapDiv.style.height = "500px";


    mapboxgl.accessToken = mapboxglAccessToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 8
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return map;
};


const onSuccess = position => {

    const {
        coords: { latitude, longitude } }
        = position;
    map = createMap(latitude, longitude);
    createMarker(latitude, longitude, map);
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

const capitalizeFirstLetters = text => {
    const separetedWords = text.split(" ");
    const arrayResult = separetedWords.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return arrayResult.join(" ");
};

const showWeatherInfo = city => {
    const {
        main: { temp },
        name,
        sys: { country },
        coord: { lat, lon },
        weather: [{ description, icon }]
    } = city;

    const iconElement = document.getElementById("icon");
    iconElement.src = `icons/${icon}.png`;

    const temprerature = document.getElementById("temperature-value");
    temprerature.innerText = `${convertKelvintoCelsius(temp)}°C`;

    const desc = document.getElementById("temperature-description");
    const capitalizeDescription = capitalizeFirstLetters(description);
    desc.innerText = capitalizeDescription;

    const place = document.getElementById("location");
    place.innerText = `${capitalizeFirstLetters(name)}, ${country}}`;

};

const searchResultsList = results => {
    const resultsList = document.getElementById("results");

    const { list: citiesList } = results;

    citiesList.map(city => {
        const {
            main: { temp },
            name,
            coord: { lat: latitude, lon: longitude },
            sys: { country },
            weather: [{ description, icon }]
        } = city;

        const listItem = document.createElement("li");
        listItem.className = "list-item";
        listItem.innerHTML = `${name}, ${country}, ${description}, ${convertKelvinToCelsius(temp)}°C`;
        const img = document.createElement("img");
        img.className = "list-item-icon";
        img.src = `icons/${icon}.png`;
        listItem.appendChild(img);
        const addButton = document.createElement("button");
        addButton.innerHTML = "+ Add";
        addButton.onclick = () => {
            createMarker(longitude, latitude);
            addElementToList(city);
        };

        listItem.appendChild(addButton);

        resultsList.appendChild(listItem);
    });
};

const addElementToList = city => {
    const {
        id,
        main: { temp },
        name,
        sys: { country },
        weather: [{ description, icon }]
    } = city;

    const container = document.getElementById("container");
    const clone = container.cloneNode(true);
    clone.id = `container-${name}-${id}`;

    //elementos container
    const [titleDiv, notificationDiv, weatherContainerDiv] = clone.children;
    title.children[0].innerHTML = `${name} Weather`;

    //elementos weathercontainerDiv
    const [weatherIconDiv, temperatureValueDiv, temperatureDescriptionDiv, locationDiv] = weatherContainerDiv.children;

    weatherContainerDiv.children[0].src = `icons/${icon}.png`;
    weatherContainerDiv.children[0].id = `icons-${name}-${id}`;

    temperatureValueDiv.children[0].id = `temperature-value-${name}-${id}`
    temperatureValueDiv.children[0].innerHTML = `${convertKelvintoCelsius(temp)}°C`;

    console.log("addElementToList", city, titleDiv, notificationDiv, weatherContainerDiv);
    const list = document.getElementsByClassName("list")[0];
    list.appendChild(clone);
};

const callWeather = (latitude, longitude) => {
    const call = fetch(`${baseURL}lat=${latitude}&lon=${longitude}&appid=${APIkey}`);

    call.then(response => response.json()).then(weatherInfo => showWeatherInfo(weatherInfo));
    call.catch(error => console.error(error));
};

const searchCityWeather = cityName => {
    const call = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`)


    call.then(response => response.json()).then(weatherSearchInfo => searchResultsList(weatherSearchInfo))
    call.catch(error => console.error(error));
    searchResultsList(mock);
};


const handleOnSearch = () => {
    const text = document.getElementById("searchInput").value;
    console.log("lo que vamos a buscar es ", text);
    if (text) {
        searchCityWeather(text.toLowerCase())
    }

};

navigator.geolocation.getCurrentPosition(onSuccess, onError);
// fetch(URL).then(onSuccess()).catch(onError());