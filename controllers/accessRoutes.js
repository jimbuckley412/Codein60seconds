const router = require('express').Router();
const { Explorer, Post } = require('../models')
const imageData = require('../seeds/imageData');
//This routes get access to the explorer's dashboard or end the explorer's session.
//Render the login form.
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/api/dashboard');
        return;
    }
    res.render('access', { imageData, background: "/images/login.jpg", stylesheet: "/css/login.css", access: "Login" });
});
//Log to your dashboard.
router.post('/login', async (req, res) => {
    try {
        const explorerData = await Explorer.findOne({
            where: {
                username: req.body.username,
            },
            include: [{ model: Post }]
        });

        if (!explorerData) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        const validPassword = explorerData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = explorerData.id;
            //Return successful response status to the client-side (where the fetch request originated)
            return res.status(200).json({
                message: "You are now logged in.",
                cookie: req.session.cookie
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//Render the view to sign-up
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/api/dashboard');
        return;
    }
    res.render('access', { imageData, background: "/images/login.jpg", stylesheet: "/css/login.css", access: "Sign-Up" });
});
//Add a user (create a record) to the db and let the new user log-in
router.post('/signup', async (req, res) => {
    try {
        const explorerExists = await Explorer.findOne({
            where: {
                username: req.body.username
            }
        });

        if (explorerExists) {
            return res.status(403).json({ message: "Username is already taken." });
        };

        const explorerData = await Explorer.create(req.body,
            { individualHooks: true }
        );
        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = explorerData.id;
            res.status(200).json({ message: "You are now logged in." });
        });
    } catch (err) {
        res.status(422).json(err);
    }
});
//Let a user log-out by ending the session after pressing the logout link in the nav bar. Redirect the user to the homepage.
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;