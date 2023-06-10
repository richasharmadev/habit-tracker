const express = require('express');
const router = express.Router();

// User schema model
const User = require('../models/User')

// Register page
router.get('/register', (req, res) => res.render('register'));

// Login page
router.get('/login', (req, res) => res.render('login'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email } = req.body;

    let errors = [];

    if (!name || !email) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        });
    } else {
        // Checking for user validation
        User.findOne({ email: email }).then(user => {
            if (user) {
                // Throwing error if user already exists
                errors.push({ msg: 'Email ID already exists' });
                res.render('register', {
                    errors,
                    name,
                    email
                });
            } else {
                const newUser = new User({
                    name,
                    email
                });
                // Saving new user to mongodb database
                newUser
                    .save()
                    .then(user => {
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res) => {
    const { name, email } = req.body;
    // Checking for existing user using email id
    User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            let errors = [];
            errors.push({ msg: 'This email is not registered' });
            res.render('login', {
                errors,
                name,
                email
            });
        }
        // If user found then redirecting to habit tracker dashboard
        else {
            res.redirect(`/dashboard?user=${user.email}`);
        }
    });

});

// Handling logout
router.get('/logout', (req, res) => {
    res.redirect('/users/login');
});

module.exports = router;