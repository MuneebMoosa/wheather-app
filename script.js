// button hover
let weatherMode = 'hourly';
  function toggleSelection(clickedButton) {
        const buttons = document.querySelectorAll('.select');
        const highlightLine = document.querySelector('.highlight-line');

        buttons.forEach(button => {
          button.classList.remove('selected', 'active');
        });

        clickedButton.classList.add('active');

      let otherButton;
     
          if(buttons[0] === clickedButton) {
            otherButton = buttons[1];
            weatherMode = 'hourly';
          }else{
            otherButton = buttons[0];
            weatherMode = 'daily';
          }
        otherButton.classList.add('selected');

        //FROM HERE CODE BY AI NOT ME :) :)
        const lineDiv = document.querySelector('.line-div');
        const lineDivRect = lineDiv.getBoundingClientRect();
        const clickedRect = clickedButton.getBoundingClientRect();

        // Calculate left position relative to lineDiv
        const left = clickedRect.left - lineDivRect.left;

        // Set the width same as the button width
        const width = clickedRect.width;

        // Apply position and width to the highlight line
        highlightLine.style.left = left + 'px';
        highlightLine.style.width = width + 'px';
         getWeather();
    }
    
//button hover

//location input box start
const input = document.getElementById('locationInput');
const displayCity = document.getElementById('displayCity');

input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const newCity = input.value.trim(); 
    if (newCity !== '') {
      displayCity.textContent = newCity; 
      input.value = ''; 
      input.style.visibility = "hidden";
      displayCity.style.visibility ="visible"
      getWeather();
    }
  }
});
const addLoc = document.querySelector('.loc-svg');

addLoc.addEventListener('click', () => {
     input.style.visibility = "visible"; 
     displayCity.style.visibility ="hidden"
})
//location input box ends


// wheather logic start


// hordValue
async function getWeather(){
const apiKey = 'ecd14a630923ebd2ba6dda5cf3a7d9bf';
const place = document.getElementById('displayCity').textContent.trim();
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${apiKey}` ;

 await  fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
          if (geoData.length === 0) {
            const newPlace = localStorage.getItem('prevplace') ;
            displayCity.textContent = newPlace;
            alert('City not found!');
            return;
          }
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(weatherUrl)
          .then(response => response.json())
          .then(data => {
            const forecasts = data.list;
            console.log(forecasts)
            //current weather
             const currentForecast = data.list[0];
              const currentIcon = currentForecast.weather[0].icon;
              const currentTemp = currentForecast.main.temp;
              const weatherType = currentForecast.weather[0].main;

            // for getting date
              const currentDate = new Date();
              const day = currentDate.getDate();
              const monthIndex = currentDate.getMonth();
              const year = currentDate.getFullYear();
              const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              const monthName = months[monthIndex];
              
              const formattedDate = `${day} ${monthName},${year}`;

              //html change
              localStorage.setItem('prevplace', place);

              document.querySelector(".data-loc").textContent = place; // You can update this dynamically if needed
              document.querySelector(".data-date").textContent = formattedDate;
              document.querySelector(".data-image").src = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`; // Example URL for weather icon
              document.querySelector(".data-image").alt = weatherType;
              document.querySelector(".data-type").textContent = weatherType;
              document.querySelector(".temp-head").innerHTML = `${Math.round(currentTemp)}&deg;`;
              
              // hourly weather start
              // const value = hordValue;
             
    if(weatherMode == 'hourly'){
       const valuePartDiv = document.querySelector('.value-part');
              valuePartDiv.innerHTML = '';
      for(let i = 0; i < 5 ; i++){
          const forecast = forecasts[i];
          const time = new Date(forecast.dt * 1000);
          const hour = time.getHours();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;

          const icon = forecast.weather[0].icon;
          const temp = forecast.main.temp;

          const html = `  <div class="value">
                              <h2 class="time1 date1">${displayHour} ${ampm}</h2>
                              <img class="value-img img1" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="'image'">
                              <h2 class="value-temp1">${Math.round(temp)}&deg;C</h2>
                            </div>`;

          valuePartDiv.innerHTML += html; 
          }
      } else {
            const dailyForecasts = [];
            let lastDate = '';
            for (let i = 0; i < forecasts.length; i++) {
              const forecast = forecasts[i];
              const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();

              if (forecastDate !== lastDate) {
                dailyForecasts.push(forecast);
                lastDate = forecastDate;
              }
              if (dailyForecasts.length === 5) {
                break; // stop after 5 days
              }
            }
            const valuePart = document.querySelector('.value-part');
            valuePart.innerHTML = '';

            for (let i = 0; i < dailyForecasts.length; i++) {
              const forecast = dailyForecasts[i];
              const dateLabel = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short', day: 'numeric', month: 'short'
              });
              const iconCode = forecast.weather[0].icon;
              const temp = Math.round(forecast.main.temp);

              const dayHTML = `
                <div class="value">
                  <h2 class="time1 date1">${dateLabel}</h2>
                  <img class="value-img img1" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">
                  <h2 class="value-temp1">${temp}&deg;C</h2>
                </div>`;

              valuePart.innerHTML += dayHTML;
            }
          }


          })//fetch weather url close 
           .catch(error => console.error('Error fetching weather data:', error));
    })//fetch close of geodata
    .catch(error => console.error('Error fetching geolocation data:', error));
  }
  