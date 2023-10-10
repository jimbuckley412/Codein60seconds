const container = document.querySelector(".container");
const parkList = document.querySelector(".dropdown-menu");
const myModal = document.querySelector('#myModal');

const apiKey = 'Pm7CQrnWT8bucBOFdTP4vrXynKLdUW088fcyo4VD';
const npsEndpoint = 'https://developer.nps.gov/api/v1/parks/';

const getParkInfo = async (event) => {
  container.innerHTML = "";

  const element = event.target;
  const selectedPark = element.getAttribute('id');

  let searchURL = npsEndpoint + '?parkCode=' + selectedPark + '&api_key=' + apiKey;

  await fetch(searchURL)
    .then((response) => {
      if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
        console.log(response.statusText);
        return Promise.reject(response.statusText);
      }
      return response.json();
    }).then((parkData) => {

      if (parkData) {
        const [park] = parkData.data;
        console.log(park.fullName);
        const random = Math.floor(Math.random() * 5);
        const url = park.images[random].url;
        const altText = park.images[random].altText;
        container.innerHTML = createCard(url, altText, park.parkCode, park.weatherInfo, park.designation, park.description, park.activities, park.operatingHours[0].description, park.operatingHours[0].standardHours, park.directionsUrl, park.directionsInfo, park.fullName, park.id);
        ;
      }
    }).catch((err) => console.error(err));
};

const imageEl = (url, altText) => {
  if (url) {
    return `<img src="${url}" alt="${altText ? altText : "N/A"}" class="card-media-img" style="max-height: 50vh;"/>`
  } else {
    return ``;
  };
};

const deleteCard =  (event) => {

  element = event.target;
  const body = element.parentElement;
  const idDiv = body.parentElement;
  const parkId = idDiv.getAttribute('data-card-id');
  const card = idDiv.parentElement;
  if(card.dataset.favorite === 'true'){
    localStorage.setItem('favoriteParks', JSON.stringify(favoriteParks.filter((park) => park.id !== parkId)));
  } else  {
    localStorage.setItem('parksToVisit', JSON.stringify(parksToVisit.filter((park) => park.id !== parkId)));
  };
 location.reload(true);
};

function createCard(url, altText, parkCode, weatherInfo, designation, description, activities, operatingHours, standardHours, directionsUrl, directionsInfo, fullName, id) {
  return `
          <div class="card" style="display:block;" data-favorite="false"> 
            <div class="card-media">
            ${imageEl(url, altText)}
            <div class="card-media-preview u-flex-center" data-card-id="${id}" id ="id">
              <span class="card-media-tag card-media-tag"><strong> Park Code: </strong> ${parkCode}</span>
            <div class="card-body">
              <h2><a href="${directionsUrl}" target="_blank" id ="fullName"><strong>${fullName}</strong></a><br></h2><br/>
              <h4>${designation ? designation : 'N/A'}</h4></br>
              <h3 style="text-align: center;"> Park Description </h3>
              <p class="text-sm font-normal">${description ? description : 'N/A'}}</p><hr/>
              <h3 style="text-align: center;"> Activities </h3>
              ${activitiesEl(activities)}
              <h3 style="text-align: center;"> Weather Info </h3>
              <p><strong>${weatherInfo ? weatherInfo : 'N/A'}</strong></p><hr/>
              <h3 style="text-align: center;"> Directions </h3>
              <p>${directionsInfo ? directionsInfo : 'N/A'}</p>
              <h3 style="text-align: center;"> Operating Hours </h3>
              <p>${operatingHours ? operatingHours : 'N/A'}</p><hr/>
              <h4> Hours per Day of the Week </h4>
              ${standardHoursList(standardHours)}
            </div>
            <button class="btn btn-secondary" type="button" onclick = "closeCard()">Close</button>
            <button class="btn btn-secondary" type="button" onclick = "addFavoritePark()">Add to Favorites!</button>
            <button class="btn btn-secondary" type="button" onclick = "addToParksToVisit()">Add to the Trails You want to Explore!</button>
            </div>
          </div>
        `;
}

function createMiniCard(id, directionsUrl, fullName, url, altText, isFavorite) {

  return `<div class="card" style="display:block;" data-favorite="${isFavorite}"> 
<div class="card-media-preview u-flex-center favorite-button" data-card-id="${id}">
<div class="card-body">
  <h2><a href="${directionsUrl}" target="_blank" id ="fullName"><strong>${fullName}</strong></a><br></h2><br/>
  ${imageEl(url, altText)}
  <button class="btn btn-secondary" type="button" onclick = "deleteCard(event)">Remove from the List</button>
  </div>
  </div>
  </div>`;

}
var favoriteParks = JSON.parse(localStorage.getItem('favoriteParks')) || [];
var parksToVisit = JSON.parse(localStorage.getItem('parksToVisit')) || [];

function showFavorites() {
  const container1 = document.querySelector('#container1');
  container1.innerHTML = '';

  if (!favoriteParks.length) {
    container1.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are all your favorite parks: </h3>`;
    const noFavoritesHeader = document.createElement('h6');
    noFavoritesHeader.className = 'card-subtitle';
    noFavoritesHeader.textContent = 'No favorite parks yet! Feel free to search for them in our site.'
    container1.innerHTML += noFavoritesHeader;
  } else {
    container1.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are all your favorite parks: </h3>`;
    for (let i = 0; i < favoriteParks.length; i++) {
      container1.innerHTML += createMiniCard(favoriteParks[i].id, favoriteParks[i].directionsUrl, favoriteParks[i].fullName, favoriteParks[i].url, favoriteParks[i].alt, true)
    }
  
  for (const child of document.querySelector('#container1').childNodes) {
    const classArr = []
    for (const classification of child.classList.values()) {
      classArr.push(classification);
    }
    if (classArr.includes('card')) child.classList.add('container1');
  };
};
}


function showParksToVisit() {
  const container2 = document.querySelector('#container2');
  container2.innerHTML = '';

  if (!parksToVisit.length) {
    container2.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are the parks you want to visit: </h3>`;
    const noParksHeader = document.createElement('h6');
    noParksHeader.className = 'card-subtitle';
    noParksHeader.textContent = `Aren't you planning to visit any parks? Join if you want recommendations from other members.`
    container2.innerHTML += noParksHeader;
  } else {
    container2.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are the parks you want to visit: </h3>`;
    for (let i = 0; i < parksToVisit.length; i++) {
      container2.innerHTML += createMiniCard(parksToVisit[i].id, parksToVisit[i].directionsUrl, parksToVisit[i].fullName, parksToVisit[i].url, parksToVisit[i].alt, false)
    }
    for (const child of document.querySelector('#container2').childNodes) {
      const classArr = []
      for (const classification of child.classList.values()) {
        classArr.push(classification);
      }
      if (classArr.includes('card')) child.classList.add('container2');
    };
  };
}

showFavorites();
showParksToVisit();

const activitiesEl = (activities) => {
  if (activities.length) {
    let stringList = `<ul>`;
    for (let i = 0; i < activities.length; i++) {
      listEl = `<li>${activities[i].name}</li>`;
      stringList += listEl;
    }
    return stringList + `</u>`;
  }
};

const standardHoursList = (standardHours) => {

  let hoursArr = [
    ["Sunday: ", standardHours.sunday],
    ["Monday: ", standardHours.monday],
    ["Tuesday: ", standardHours.tuesday],
    ["Wednesday: ", standardHours.wednesday],
    ["Thursday: ", standardHours.thursday],
    ["Friday: ", standardHours.friday],
    ["Saturday: ", standardHours.saturday]
  ];
  let hoursStr = `<ul>`;
  for (let i = 0; i < hoursArr.length; i++) {
    const listEl = `<li>${hoursArr[i][0]}${hoursArr[i][1]}</li>`
    hoursStr += listEl;
  }
  return hoursStr + `</ul>`;
}

//Event-listeners for dynamically created elements

const closeCard = () => {
  document.querySelector('.card').style.display = 'none';
  location.reload();
};
parkList.addEventListener("click", getParkInfo);

// Function to toggle a movie as a favorite
const addFavoritePark = () => {
  let parkId = document.querySelector('#id').getAttribute('data-card-id');
  let parkName = document.querySelector('#fullName').textContent;
  let parkUrl = document.querySelector('#fullName').getAttribute('href');
  let imgUrl = document.querySelector('img').getAttribute('src');
  let imgText = document.querySelector('img').getAttribute('alt');

  if (!favoriteParks.find((park) => park.id === parkId)) {
    const newFavPark = { id: parkId, fullName: parkName, directionsUrl: parkUrl, url: imgUrl, alt: imgText };
    favoriteParks.push(newFavPark);
  }
  localStorage.setItem('favoriteParks', JSON.stringify(favoriteParks));
  closeCard();
};

const addToParksToVisit = () => {
  let parkId = document.querySelector('#id').getAttribute('data-card-id');
  let parkName = document.querySelector('#fullName').textContent;
  let parkUrl = document.querySelector('#fullName').getAttribute('href');
  let imgUrl = document.querySelector('img').getAttribute('src');
  let imgText = document.querySelector('img').getAttribute('alt');

  if (!parksToVisit.find((park) => park.id === parkId)) {
    const newParkToVisit = { id: parkId, fullName: parkName, directionsUrl: parkUrl, url: imgUrl, alt: imgText }
    parksToVisit.push(newParkToVisit);
  };
  localStorage.setItem('parksToVisit', JSON.stringify(parksToVisit));
  closeCard();
};



