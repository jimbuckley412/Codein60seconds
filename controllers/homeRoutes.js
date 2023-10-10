const router = require('express').Router();
const { apiKey, npsEndpoint } = require('../public/scripts/npsData');
const imageData = require('../seeds/imageData');

let stateParks = [];
let state;

//Displays the homepage
router.get('/', async (req, res) => {
        if(!stateParks.length){
        res.render('homepage', { imageData, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        } else {
        res.render('homepage', { stateParks, state, background: imageData[0].file_path, stylesheet: "/css/style.css" });
        }

});

router.post('/', async (req, res) => {
    const { stateCode } = req.body;
    state = stateCode;
    await fetch(npsEndpoint + '?stateCode=' + stateCode + '&api_key=' + apiKey)
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
});

/*router.get('/parks', async (req, res) => {

})*/
module.exports = router;
