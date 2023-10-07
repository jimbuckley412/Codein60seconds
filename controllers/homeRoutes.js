const router = require('express').Router();
const imageData = require('../seeds/imageData');
//Displays the homepage
router.get('/', async (req, res) => {
    res.render('homepage', { imageData, background: imageData[0].file_path, stylesheet: "/css/style.css" });
});

module.exports = router;
