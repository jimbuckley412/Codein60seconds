const container = document.querySelector(".container");
const parkList = document.querySelector(".dropdown-menu");

const apiKey = 'Pm7CQrnWT8bucBOFdTP4vrXynKLdUW088fcyo4VD';
const npsEndpoint = 'https://developer.nps.gov/api/v1/parks/';

const getParkInfo = async (event) => {
  container.innerHTML = "";

  const element = event.target;
  const selectedPark = element.getAttribute('id');

  let searchURL = npsEndpoint + '?parkCode=' + selectedPark + '&api_key=' + apiKey;

  await fetch(searchURL)
    .then((response) => {
      if (!response.ok) return Promise.reject(response.statusText);
      return response.json();

    }).then((parkData) => {

      if (parkData) {
        const [park] = parkData.data;
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

const miniImageEl = (url, altText) => {
  if (url) {
    return `<img src="${url}" alt="${altText ? altText : "N/A"}" class="card-media-img" style="max-height: 20vh;"/>`
  } else {
    return ``;
  };

}
const deleteCard = (event) => {

  element = event.target;
  const body = element.parentElement;
  const idDiv = body.parentElement;
  const parkId = idDiv.getAttribute('data-card-id');
  const card = idDiv.parentElement;
  if (card.dataset.favorite === 'true') {
    localStorage.setItem('favoriteParks', JSON.stringify(favoriteParks.filter((park) => park.id !== parkId)));
  } else {
    localStorage.setItem('parksToVisit', JSON.stringify(parksToVisit.filter((park) => park.id !== parkId)));
  };
  location.reload(true);
};

function createCard(url, altText, parkCode, weatherInfo, designation, description, activities, operatingHours, standardHours, directionsUrl, directionsInfo, fullName, id) {
  return `
          <div class="card" style="display:block; position: absolute; top: 20vh; left: 25vw; max-width: 50vw;" data-favorite="false"> 
            <div class="card-media">
            ${imageEl(url, altText)}
            <div class="card-media-preview u-flex-center" id ="id" data-card-id="${id}" >
              <span class="card-media-tag card-media-tag" id= "parkCode"><strong> Park Code: </strong> ${parkCode}</span>
            <div class="card-body">
              <h2><a href="${directionsUrl}" target="_blank" id ="fullName"><strong>${fullName}</strong></a></h2><br/>
              <h4 id="designation">${designation ? designation : 'N/A'}</h4></br>
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
            <button type="button" class="btn btn-secondary" onclick = "getThingsToDo()" id= "thingsToDo">Recommended Things To Do</button>
            </div>
          </div>
        `;
}

function createMiniCard(id, directionsUrl, fullName, url, altText, designation, isFavorite) {

  return `<div class="card" style="display:block;" data-favorite="${isFavorite}"> 
<div class="card-media-preview u-flex-center favorite-button" data-card-id="${id}">
<div class="card-body">
  <h2><a href="${directionsUrl}" target="_blank" ><strong>${fullName}</strong></a><br></h2><br/>
  ${miniImageEl(url, altText)}
  <h4 style="text-alig: right;">${designation}</h4>
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
    container1.innerHTML += `<h4 style="color: gray;">No favorite parks yet! Feel free to search for them in our site.</h4>`
  } else {
    container1.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are all your favorite parks: </h3>`;
    for (let i = 0; i < favoriteParks.length; i++) {
      container1.innerHTML += createMiniCard(favoriteParks[i].id, favoriteParks[i].directionsUrl,
        favoriteParks[i].fullName, favoriteParks[i].url, favoriteParks[i].alt,
        favoriteParks[i].designation, true)
    };
    };
  };



function showParksToVisit() {
  const container2 = document.querySelector('#container2');
  container2.innerHTML = '';

  if (!parksToVisit.length) {
    container2.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are the parks you want to visit: </h3>`;
    container2.innerHTML += `<h4 style="color: gray;">Aren't you planning to visit any parks? Join if you want recommendations from other members.</h4>`;
  } else {
    container2.innerHTML = `<h3 class= "card-title" style= "background-color: white;">Here are the parks you want to visit: </h3>`;
    for (let i = 0; i < parksToVisit.length; i++) {
      container2.innerHTML += createMiniCard(parksToVisit[i].id, parksToVisit[i].directionsUrl,
        parksToVisit[i].fullName, parksToVisit[i].url, parksToVisit[i].alt,
        parksToVisit[i].designation, false)
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
  let parkDesignation = document.querySelector('#designation').textContent;

  if (!favoriteParks.find((park) => park.id === parkId)) {
    const newFavPark = { id: parkId, fullName: parkName, directionsUrl: parkUrl, url: imgUrl, alt: imgText, designation: parkDesignation };
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
  let parkDesignation = document.querySelector('#designation').textContent;


  if (!parksToVisit.find((park) => park.id === parkId)) {
    const newParkToVisit = { id: parkId, fullName: parkName, directionsUrl: parkUrl, url: imgUrl, alt: imgText, designation: parkDesignation }
    parksToVisit.push(newParkToVisit);
  };
  localStorage.setItem('parksToVisit', JSON.stringify(parksToVisit));
  closeCard();
};



