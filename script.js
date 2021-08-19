let coordinates = document.querySelector('.coordinates')
let searchButtonLocation = document.querySelector('.search-button-location')
let latText = document.querySelector('.lat')
let longText = document.querySelector('.long')

let cityLocation = document.querySelector('.input-city')
let searchButtonCity = document.querySelector('.search-button-city')
let cityFromInput = ''

let lat = ''
let long = ''

let cityInfo = document.querySelector('.cityInfo')
let todayWeather = document.querySelector('.today')
let resultField = document.querySelector('.result')

searchButtonLocation.addEventListener('click', getLocation)
searchButtonCity.addEventListener('click', getCity)

function getLocation(e) {
  e.preventDefault()
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    forecast5Days(lat, long)
  })
}

function getCity(e) {
  e.preventDefault()
  cityFromInput = cityLocation.value

  fetch(`https://us1.locationiq.com/v1/search.php?key=pk.6809b6a60ee84e9e5fdf8fa8763cb48e&q=${cityFromInput}&format=json`)
    .then(response => response.json())
    .then(response => {
      console.log(response[0])
      lat = Number(response[0].lat)
      long = Number(response[0].lon)

      forecast5Days(lat, long)
    })
    .catch((err) => {
      console.error('Error:', err)
    })

  cityLocation.value = ''
}

function forecast5Days(lat, long) {
  cityInfo.innerHTML = ''
  todayWeather.innerHTML = ''
  resultField.innerHTML = ''

  fetch(` https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&key=4976d7d995f44854815fc2157e3a2ae1`)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      let city = response.city_name
      let tempToday = response.data[0].temp
      let descriptionToday = response.data[0].weather.description
      let iconToday = response.data[0].weather.icon
      let currentDateToday = (response.data[0].datetime).split('-')
      let countryCode = response.country_code
      let humidityToday = response.data[0].rh
      let pressureToday = response.data[0].pres

      let cityInfoHeader = document.createElement('h2')
      cityInfoHeader.innerHTML = (city + ', ' + countryCode)
      cityInfo.appendChild(cityInfoHeader)

      let todayInfo = document.createElement('div')
      todayInfo.setAttribute("class", "weather-box-today")

      todayInfo.innerHTML = `
        <div class="temp-icon">
          <h1 class="temp">${tempToday}&#8451;</h1>
          <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${iconToday}.png" />
        </div>
        <small>${descriptionToday}</small>
        <div class="location-date">Today: <b>${currentDateToday[2]}/${currentDateToday[1]}/${currentDateToday[0]}</b></div>
        <div class="details">Humidity: <b>${humidityToday}</b>, Pressure: <b>${pressureToday}</b></div>
        <br />
      `

      todayWeather.appendChild(todayInfo)

      for (let i = 1; i < 6; i++) {

        let temp = response.data[i].temp
        let maxTemp = response.data[i].max_temp
        let minTemp = response.data[i].low_temp
        let description = response.data[i].weather.description
        let icon = response.data[i].weather.icon
        let currentDate = (response.data[i].datetime).split('-')
        let humidity = response.data[i].rh
        let pressure = response.data[i].pres

        const divEl = document.createElement('div')
        divEl.setAttribute("class", "weather-box")

        divEl.innerHTML = `
        <br />
        <div class="temp-icon">
          <h2 class="temp">${temp}&#8451;</h2>
          <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${icon}.png" />
        </div>
        <small>${description}</small>
        <div class="maxMin">Max temp: <b>${maxTemp}&#8451;</b>,   Min temp: <b>${minTemp}&#8451;</b></div>
        <div class="details">Humidity: <b>${humidity}</b>, Pressure: <b>${pressure}</b></div>
        <div class="location-date">Date: <b>${currentDate[2]}/${currentDate[1]}/${currentDate[0]}</b></div>
        <br />
        `

        resultField.appendChild(divEl)
      }
    })
    .catch(err => {
      console.error(err)
    });
}