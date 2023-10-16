const router = require('express').Router();
const { Explorer } = require('../models');
const { apiKey, stateResponse, npsThingsToDoEndpoint, npsActivitiesEndpoint, npsTopicsEndpoint } = require('../public/nps-api-info/npsData');
const axios = require('axios');


const mainImage = require('../seeds/mainImage');
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

    const loggedIn = req.session.loggedIn;
    if (loggedIn) {
        const explorerData = await Explorer.findByPk(req.session.userId);
        const username = explorerData.username;
        res.render('homepage', {
            imageData, activities, topics,
            state, stateParks, selectedPark,
            actId, selectedActivity, actParks,
            topicId, selectedTopic, topicParks,
            thingsToDo,
            loggedIn,
            username,
            background: mainImage[0].file_path, stylesheet: "/css/style.css"
        });
    } else {
        res.render('homepage', {
            imageData, activities, topics,
            state, stateParks, selectedPark,
            actId, selectedActivity, actParks,
            topicId, selectedTopic, topicParks,
            thingsToDo,
            background: mainImage[0].file_path, stylesheet: "/css/style.css"
        });
    }
});

router.post('/', async (req, res) => {
    if (req.body.stateCode) {
        state = req.body.stateCode;
        try {
            const stateResponse = await axios.get('https://developer.nps.gov/api/v1/parks?stateCode=' + req.body.stateCode + '&api_key=' + apiKey);
            const stateData = stateResponse.data;
            stateParks = [];
            for (let i = 0; i < stateData.total; i++) {
                const { parkCode, fullName, activities } = parksData.data[i];
                const activitiesNames = activities.map((activity) => activity.name);

                if (activitiesNames.includes('Hiking') || activitiesNames.includes('Biking')
                    || activitiesNames.includes('Kayaking') || activitiesNames.includes('Canoeing')
                    || activitiesNames.includes('Camping')) {

                    const park = {
                        parkCode,
                        fullName
                    };
                    stateParks.push(park);
                }
            }
            return res.status(201).json({ stateParks });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }

        if (req.body.code) {
            selectedPark = req.body.name;
            try {
                const thingsResponse = await axios.get('https://developer.nps.gov/api/v1/thingstodo?parkCode=' + req.body.code + '&api_key=' + apiKey);
                const thingsData = thingsResponse.data;
                thingsToDo = [];
                for (let i = 0; i < thingsData.data.length; i++) {
                    const { id, url, title,
                        shortDescription, images, season,
                        timeOfDay, duration } = thingsData.data[i];

                    const TimeOfDay = timeOfDay ? timeOfDay : 'N/A';
                    const Duration = duration ? duration : 'N/A';
                    const thing = {
                        id, url, title,
                        shortDescription, images, season,
                        TimeOfDay, Duration
                    };

                    thingsToDo.push(thing);
                };
                return res.status(201).json({ thingsToDo });
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }

        if (req.body.clearThingsToDo) {
            thingsToDo = [];
        }

        if (req.body.actId) {
            actId = req.body.actId;
            selectedActivity = req.body.actName;
            try {
                const actParksResponse = await axios.get('https://developer.nps.gov/api/v1/activities?parkCode=' + req.body.actId + '&api_key=' + apiKey);
                const actParksData = actParksResponse.data;
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
                }
                return res.status(201).json({ stateParks });
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }

        if (req.body.topicId) {
            topicId = req.body.topicId;
            selectedTopic = req.body.topicName;
            try {
                const topicParksResponse = await axios.get('https://developer.nps.gov/api/v1/topics?parkCode=' + req.body.topicId + '&api_key=' + apiKey);
                const topicParksData = topicParksResponse.data;
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
                }
                return res.status(201).json({ stateParks });
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }
    }
});

router.put('/', (req, res) =>{

    if (req.body.clearModalData) {
        actParks = [];
        topicParks = [];
        thingsToDo = [];
        res.status(200).json({message: 'Data to render modal was cleared.'});
    };
})

module.exports = router;
