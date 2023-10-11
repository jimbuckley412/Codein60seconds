const router = require('express').Router();
const { Explorer } = require('../models');
const { apiKey, npsEndpoint, npsThingsToDoEndpoint, npsActivitiesEndpoint, npsTopicsEndpoint } = require('../public/nps-api-info/npsData');

const imageData = require('../seeds/imageData');
const activities = require('../public/nps-api-info/nps-activities');
const topics = require('../public/nps-api-info/nps-topics');


let state;
let selectedPark;
let stateParks = [];

let actId;
let selectedActivity;
let actParks = [];

let topicId;
let selectedTopic;
let topicParks = [];

let thingsToDo = [];

//Displays the homepage
router.get('/', async (req, res) => {
   
    const explorerData  = await Explorer.findByPk(req.session.userId);
    const username = explorerData.username;
    console.log(username);
    res.render('homepage', {imageData, activities, topics, 
                 state, stateParks, selectedPark, 
                 actId, selectedActivity, actParks,
                 topicId, selectedTopic, topicParks, 
                 thingsToDo, 
                 loggedIn: req.session.loggedIn,
                 username,
                 background: imageData[0].file_path, stylesheet: "/css/style.css"});
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

    if(req.body.topicId){

        topicId = req.body.topicId;
        selectedTopic = req.body.topicName;

        await fetch(npsTopicsEndpoint + '?id=' + req.body.topicId + '&api_key=' + apiKey)
        .then((response) => {
            if (!response.ok) {
                return res.json({ message: response.statusText });
            }
            return response.json();
        }).then((topicParksData) => {
             topicParks = [];
            for (let i = 0; i < topicParksData.data[0].parks.length; i++) {
                const { states, parkCode, designation, fullName, url } = topicParksData.data[0].parks[i];
                const park = {
                    states,
                    parkCode,
                    designation,
                    fullName,
                    url
                };
                topicParks.push(park);
            };
            return res.status(201).json({ stateParks });
        }).catch((err) => console.error(err));
    }

    if(req.body.clearModalData){
        actParks= [];
        topicParks= [];
        thingsToDo= [];
    }
});

module.exports = router;
