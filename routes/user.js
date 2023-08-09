const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const {isLoggedIn} = required("../middlewares/auth.middlewares.js")

router.get("/", isLoggedIn, (req, res, next) => {
    //esta vista debería ser privada solo para usuarios con sesión activa
    console.log(req.session.user)
    //si es undefined => el usuario no ha hecho login
    //si es un objeto => el usuario está activo

    User.findById(req.session.user._id)
    .then ((response) => {
        res.render("user-profile.hbs", {
            user: response
        })
    })
})