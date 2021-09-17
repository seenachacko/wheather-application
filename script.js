const userInput = document.getElementById("userInput");
const submitButton = document.getElementById("submitButton");
const displaySection = document.getElementById("display")

submitButton.addEventListener("click", searchByCity)
function searchByCity() {
    const alert= document.getElementById("alert");
    const cityName = userInput.value;
    if (cityName === "") {
        alert.innerHTML="Please enter city name"
    } else {
        alert.innerHTML ="";
        fetch(` https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f0ce6478459bc391572e61d8a52e829d`)
            .then((response) => response.json())
            .then((whetherData) => {
                console.log(whetherData);
                printItems(whetherData)
            })
    }
}

function printItems(whetherData) {
    console.log(whetherData);
    displaySection.innerHTML = "";
    const imageHolder = document.createElement("img")
    const WeatherIcon = whetherData.weather[0].icon
    imageHolder.src = ` http://openweathermap.org/img/wn/${WeatherIcon}@2x.png`
    displaySection.appendChild(imageHolder);
    const h2 = document.createElement("h2");
    h2.innerHTML = whetherData.name;
    userInput.value = whetherData.name;
    const saveTolocalStorage=localStorage.setItem('cityName',whetherData.name);
    displaySection.appendChild(h2);
    const list = document.createElement("ul");
    displaySection.appendChild(list)
    const temperature = document.createElement("li");
    const kelvinToCel = whetherData.main.temp - 273
    temperature.innerHTML = `Temperature: ${Math.floor(kelvinToCel).toFixed(1)} C`;
    displaySection.appendChild(temperature);
    const windSpeed = document.createElement("li");
    windSpeed.innerHTML = `Wind Speed: ${whetherData.wind.speed}m/s`;
    displaySection.appendChild(windSpeed);
    const cloudy = document.createElement("li");
    cloudy.innerHTML = `Cloud: ${whetherData.clouds.all}`;
    displaySection.appendChild(cloudy);
    const sunRise = document.createElement("li");
    const exactSunriceTime = new Date(whetherData.sys.sunrise * 1000);
    sunRise.innerHTML = "sunrise:" + exactSunriceTime.toLocaleTimeString('en-US');
    displaySection.appendChild(sunRise);
    const sunSet = document.createElement("li");
    const exactSunset = new Date(whetherData.sys.sunset * 1000);
    sunSet.innerHTML = "sunSet:" + exactSunset.toLocaleTimeString('en-US');
    displaySection.appendChild(sunSet);
    const latitude = whetherData.coord.lat;
    const longitude = whetherData.coord.lon;
    displayMap(longitude, latitude);
    console.log(longitude, latitude);

}


const getCurrentLocationButton = document.getElementById("getCurrentLocation");
getCurrentLocationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude
    console.log("Latitude: " + latitude + " - Longitude: " + longitude);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f0ce6478459bc391572e61d8a52e829d`)
        .then((response) => response.json())
        .then((whetherData) => {
            console.log(whetherData.name);
            printItems(whetherData)
        })
}
function error() {
    console.log('Unable to retrieve your location');
}


function displayMap(longitude, latitude) {
    let map = document.getElementById("map");
    map.innerHTML = "";
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([longitude, latitude]),
            zoom: 10
        })
    });

}

window.addEventListener("load",event =>{
    const ItemfromLocalStorage =localStorage.getItem('cityName');
    userInput.value = ItemfromLocalStorage;
    searchByCity();

})