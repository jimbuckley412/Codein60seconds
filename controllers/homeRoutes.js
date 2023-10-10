const router = require('express').Router();
const { apiKey, npsEndpoint, npsThingsToDoEndpoint, npsActivitiesEndpoint } = require('../public/nps-api-info/npsData');
const activities = require('../public/nps-api-info/nps-activities');
const imageData = require('../seeds/imageData');
const topics = require('../public/nps-api-info/nps-topics');

let stateParks = [];
let state;
let thingsToDo = [];
let selectedPark;
let selectedActivity;
let actId;
let actParks = [];

//Displays the homepage
router.get('/', async (req, res) => {
        if(!stateParks.length && !actParks.length){
        res.render('homepage', { imageData, activities, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        } else if(stateParks.length && !(thingsToDo.length || actParks.length) ){
        res.render('homepage', { stateParks, activities, state, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        } else if (stateParks.length && thingsToDo.length){
        res.render('homepage', { thingsToDo, activities, selectedPark, stateParks, state, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        } else if(stateParks.length && actParks.length){
        res.render('homepage', {activities, selectedActivity, actId, actParks, selectedPark, stateParks, state, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        } else {
            res.render('homepage', {activities, selectedActivity, actId, actParks, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        }
});

router.post('/', async (req, res) => {

    if(req.body.stateCode){

    state = req.body.stateCode;
    
    await fetch(npsEndpoint + '?stateCode=' + req.body.stateCode + '&api_key=' + apiKey)
        .then((response) => {
            if (!response.ok) {
                return res.json({ message: response.statusText });
            }
            return response.json();
        }).then((parksData) => {
            stateParks = [];
            for (let i = 0; i < parksData.total; i++) {
                const { parkCode, fullName } = parksData.data[i];
                const park = {
                    parkCode,
                    fullName
                };
                stateParks.push(park);
            };
            return res.status(201).json({ stateParks });
        }).catch((err) => console.error(err));
    }
    if(req.body.code){

        selectedPark = req.body.name;

        await fetch(npsThingsToDoEndpoint+ '?parkCode=' + req.body.code + '&api_key=' + apiKey)
        .then((response) => {
            if (!response.ok) {
                return res.json({ message: response.statusText });
            }
            return response.json();
        }).then((thingsData) => {
            thingsToDo = [];
            for (let i = 0; i < thingsData.data.length; i++) {
                const { id, url, title, 
                    shortDescription, images, season, 
                    timeOfDay, duration } = thingsData.data[i];

                const TimeOfDay = timeOfDay? timeOfDay: 'N/A';
                const Duration = duration? duration: 'N/A';
                const thing = { id, url, title, 
                    shortDescription, images, season, 
                  TimeOfDay, Duration };

                thingsToDo.push(thing);
            };
            return res.status(201).json({ thingsToDo });
        }).catch((err) => console.error(err));

    }

    if(req.body.clearThingsToDo){
        thingsToDo = [];
    }

    if(req.body.actId){
        actId = req.body.actId;
        selectedActivity = req.body.actName;

        await fetch(npsActivitiesEndpoint + '?id=' + req.body.actId + '&api_key=' + apiKey)
        .then((response) => {
            if (!response.ok) {
                return res.json({ message: response.statusText });
            }
            return response.json();
        }).then((actParksData) => {
            actParks = [];
            for (let i = 0; i < actParksData.data[0].parks.length; i++) {
                const { states, parkCode, designation, fullName, url } = actParksData.data[0].parks[i];
                const park = {
                    states,
                    parkCode,
                    designation,
                    fullName,
                    url
                };
                actParks.push(park);
            };
            return res.status(201).json({ stateParks });
        }).catch((err) => console.error(err));
    }
    if(req.body.clearActParks){
        actParks= [];
    }
});

module.exports = router;
