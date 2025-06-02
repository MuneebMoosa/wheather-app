// button hover
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
    }else{
      otherButton = buttons[0];
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

const apiKey = 'ecd14a630923ebd2ba6dda5cf3a7d9bf';
function getWeather(){
const place = document.getElementById('displayCity').textContent.trim();
  if (!place) {
      console.error('No city entered.');
      return;
    }
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${apiKey}` ;

  fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
          if (geoData.length === 0) {
            alert('City not found!');
            return;
          }
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

       const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}&units=metric`;

   fetch(weatherUrl)
          .then(response => response.json())
          .then(data => {
            //current weather
              // const current = data.current; // any prob check
              const currentIcon = data.weather[0].icon;
              const currentTemp = data.main.temp;
              const weatherType = data.weather[0].main;
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

              document.querySelector(".data-loc").textContent = place; // You can update this dynamically if needed
              document.querySelector(".data-date").textContent = formattedDate;
              document.querySelector(".data-image").src = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`; // Example URL for weather icon
              document.querySelector(".data-image").alt = weatherType;
              document.querySelector(".data-type").textContent = weatherType;
              document.querySelector(".temp-head").innerHTML = `${Math.round(currentTemp)}&deg;`;


          })//fetch weather url close 
           .catch(error => console.error('Error fetching weather data:', error));
    })//fetch close of geodata
    .catch(error => console.error('Error fetching geolocation data:', error));
  }
  