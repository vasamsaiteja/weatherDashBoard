const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItemsEl = document.getElementById('current-weather-items')
const timezone = document.getElementById('time-zone')
const countryEl = document.getElementById('country')
const weatherForecastEl = document.getElementById('weatherForecast')
const hourForecastEl = document.getElementById('hourForecast')
const currentTempEl = document.getElementById('currentTemp')
const hourEl = document.getElementById('hourTemp')
const formEl = document.getElementById('form')
const weatherEl = document.getElementById('weather-report')
const cityInputEl = document.getElementById('cityInput')
const darkModeEl = document.getElementById('darkMode')
const sectionContainerEl = document.getElementById('sectionContainer')

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const API_KEY = '0bd57f215a5c0b9d7abba9a6e5f2a748'
let isDark = false
const darkMode = () => {
    sectionContainerEl.classList.toggle('dark-mode')
    if (isDark) {
        darkModeEl.innerHTML = 'Light Mode'
    } else {
        darkModeEl.innerHTML = 'Dark Mode'
    }

    isDark = !isDark
}

darkModeEl.addEventListener('click', darkMode)

const handleSubmit = async(e) => {
    e.preventDefault()
    const cityValue = document.getElementById('cityInput').value

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${API_KEY}&units=metric`
        //console.log(url)
    const response = await fetch(url)
    const data = await response.json()

    console.log('data', data)
    let name = data.name

    cityInputEl.value = ''
    let { humidity, pressure, temp, temp_max, temp_min } = data.main
    weatherEl.innerHTML = `
		
		<div>
			<img src="http://openweathermap.org/img/wn//${data.weather[0].icon}@2x.png" alt="weather icon" class="w-icon1">
			<span>${name}</span>
		</div>
		<div class="weather-item">
				<h5>Humidity</h5>
				<h5>${humidity} %</h5>
			</div>
			<div class="weather-item">
				<h5>Pressure</h5>
				<h5>${pressure} Pa</h5>
			</div>
			<div class="weather-item">
				<h5>Temp</h5>
				<h5>${temp}\u00B0 C</h5>
		</div>     
		<div class="weather-item">
				<h5>Max Temp</h5>
				<h5>${temp_max}\u00B0 C</h5>
		</div>  
		<div class="weather-item">
				<h5>Min Temp</h5>
				<h5>${temp_min}\u00B0 C</h5>
		</div>         
    `
}

formEl.addEventListener('submit', handleSubmit)

setInterval(() => {
    const time = new Date()
    const month = time.getMonth()
    const date = time.getDate()
    const day = time.getDay()
    const hour = time.getHours()
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML =
        (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ' ' +
        `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000)

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords

        fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=gminutely&units=metric&appid=${API_KEY}`
            )
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                showWeatherData(data)
            })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current

    timezone.innerHTML = data.timezone
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'

    currentWeatherItemsEl.innerHTML = `
      
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>

    `

    let otherDayForcast = ''

    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
							day.weather[0].icon
						}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
									.moment(day.dt * 1000)
									.format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>

            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
									.moment(day.dt * 1000)
									.format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${
									day.weather[0].icon
								}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>

            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast

    let otherHourForecast = ''
    let hourweather = data.hourly
    console.log(hourweather)
    hourweather.map((hour, idx) => {
        if (idx == 0) {
            hourEl.innerHTML = `
			<h3>${(new Date().getHours() + idx) % 12}:00 Hrs</h3>
            <img src="http://openweathermap.org/img/wn//${
							hour.weather[0].icon
						}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Humidity :${hour.humidity}</div>
                <div class="temp">${hour.temp}&#176;C</div>
                <div class="temp">${hour.wind_speed}</div>
            </div>

            `
        } else {
            otherHourForecast += `
			<div class="weather-forecast-item">
			<h3>${(new Date().getHours() + idx) % 12}:00 Hrs</h3>
            <img src="http://openweathermap.org/img/wn//${
							hour.weather[0].icon
						}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">
                <div class="temp">Humidity :${hour.humidity}%</div>
                <div class="temp">${hour.temp}&#176;C</div>
                <div class="temp">${hour.wind_speed}</div>
            </div>
			</div>

            `
        }
        console.log(hour)
        console.log(idx)
    })

    hourForecastEl.innerHTML = otherHourForecast
}