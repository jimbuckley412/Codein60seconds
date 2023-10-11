const router = require('express').Router();
const withAuth = require('../../utils/auth');
const imageData = require('../../seeds/imageData');
const { Explorer, Post, Comment, ExplorerPark, Park } = require('../../models');

const { apiKey, npsEndpoint, npsThingsToDoEndpoint, npsActivitiesEndpoint, npsTopicsEndpoint } = require('../../public/nps-api-info/npsData');

const activities = require('../../public/nps-api-info/nps-activities');
const topics = require('../../public/nps-api-info/nps-topics');


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
router.get('/', withAuth, async (req, res) => {

    const explorerData = await Explorer.findByPk(req.session.userId);
    const username = explorerData.username;

    res.render('add-delete-parks', {
        imageData, activities, topics,
        state, stateParks, selectedPark,
        actId, selectedActivity, actParks,
        topicId, selectedTopic, topicParks,
        thingsToDo,
        loggedIn: req.session.loggedIn,
        username,
        background: imageData[0].file_path, stylesheet: "/css/style.css"
    });
});

router.post('/', async (req, res) => {

    if (req.body.stateCode) {

        state = req.body.stateCode;

        console.log(state)

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
    if (req.body.code) {

        selectedPark = req.body.name;

        await fetch(npsThingsToDoEndpoint + '?parkCode=' + req.body.code + '&api_key=' + apiKey)
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
            }).catch((err) => console.error(err));

    }

    if (req.body.clearThingsToDo) {
        thingsToDo = [];
    }

    if (req.body.actId) {
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

    if (req.body.topicId) {

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

    if (req.body.clearModalData) {
        actParks = [];
        topicParks = [];
        thingsToDo = [];
    }

    if (req.body.newFavPark) {
       
        try {
            const newFavData = await Park.create(req.body.newFavPark);
            
            const parkId = newFavData.id;

                const explorerPark = {
                is_favorite: true,
                explorer_id: req.session.userId,
                park_id: parkId
            };
            await ExplorerPark.create(explorerPark);

            res.status(201).json({ message: "New favorite park added!" });
        } catch(err){
            if (err) res.status(400).json(err);
        }
    }

    if (req.body.newFavPark) {
       
        try {
            const newFavData = await Park.create(req.body.newFavPark);
            
            const parkId = newFavData.id;

                const explorerPark = {
                is_favorite: true,
                explorer_id: req.session.userId,
                park_id: parkId
            };
            await ExplorerPark.create(explorerPark);

            res.status(201).json({ message: "New favorite park added!" });
        } catch(err){
            if (err) res.status(400).json(err);
        }
    }

    
    if (req.body.visitedPark) {
       
        try {
            const visitedData = await Park.create(req.body.visitedPark);
            
            const parkId = visitedData.id;

                const explorerPark = {
                has_visited: true,
                explorer_id: req.session.userId,
                park_id: parkId
            };
            await ExplorerPark.create(explorerPark);

            res.status(201).json({ message: "New park added to your been-there list!" });
        } catch(err){
            if (err) res.status(400).json(err);
        }
    }

    
    if (req.body.newParkToVisit) {
       
        try {
            const newToVisitData = await Park.create(req.body.newParkToVisit);
            
            const parkId = newToVisitData.id;

                const explorerPark = {
                explorer_id: req.session.userId,
                park_id: parkId
            };
            await ExplorerPark.create(explorerPark);

            res.status(201).json({ message: "New park added to your bucket list!" });
        } catch(err){
            if (err) res.status(400).json(err);
        }
    }
});

//Render the page in which you can find a registered user's favorite parks
router.get('/explorers/:id/favorites', withAuth, async (req, res) => {
    try {
        const explorerData = await Explorer.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Park, through: ExplorerPark, as: 'your_parks' }],
        });
        const explorer = explorerData.get({ plain: true });
        let favoriteParks;
        if (explorer.your_parks.length) {
            favoriteParks = explorer.your_parks.filter((park) => park.explorer_park.is_favorite);
        } else {
            favoriteParks = [];
        }
        let ownParks = req.params.id == req.session.userId;
        res.render('view-parks', {
            ...explorer,
            favoriteParks,
            loggedIn: req.session.loggedIn,
            ownParks,
            background: imageData[1].file_path,
            stylesheet: "/css/style.css"
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//Render the page in which you can find a registered user's already visited parks
router.get('/explorers/:id/visited', withAuth, async (req, res) => {
    try {
        const explorerData = await Explorer.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Park, through: ExplorerPark, as: 'your_parks' }],
        });
        const explorer = explorerData.get({ plain: true });
        let visitedParks;
        if (explorer.your_parks.length) {
            visitedParks = explorer.your_parks.filter((park) => park.explorer_park.has_visited);
        } else {
            visitedParks = [];
        }
        let ownParks = req.params.id == req.session.userId;
        res.render('view-parks', {
            ...explorer,
            visitedParks,
            loggedIn: req.session.loggedIn,
            ownParks,
            background: imageData[1].file_path,
            stylesheet: "/css/style.css"
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//Render the page in which you can find a registered user's parks to visit list
router.get('/explorers/:id/to_visit', withAuth, async (req, res) => {
    try {
        const explorerData = await Explorer.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Park, through: ExplorerPark, as: 'your_parks' }],
        });
        const explorer = explorerData.get({ plain: true });
        let planToVisitParks;
        if (explorer.your_parks.length) {
            planToVisitParks = explorer.your_parks.filter((park) => (park.explorer_park.is_favorite === false && park.explorer_park.has_visited === false));
        } else {
            planToVisitParks = [];
        }
        let ownParks = req.session.userId == req.params.id;
        res.render('view-parks', {
            ...explorer,
            planToVisitParks,
            loggedIn: req.session.loggedIn,
            ownParks,
            background: imageData[1].file_path,
            stylesheet: "/css/style.css"
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;