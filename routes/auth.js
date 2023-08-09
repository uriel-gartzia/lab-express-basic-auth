const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model.js");

//GET Sign-in renderiza al usuario un formulario de registro
router.get("/sign-in", (req, res, next) => {
  res.render("auth/sign-in.hbs");
});

//POST recibir data del registro crear user en la DB
router.post("/sign-in", async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  //validación para que los campos sean rellenados
  if (username === 0 || password === 0) {
    req.statusCode(400).render("auth/sign-in.hbs", {
      errorMessage: "Todos los campos deben ser rellenados",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ $or: [{ username: username }] });
    console.log(foundUser);
    //si existe un usuario igual
    if (foundUser !== null) {
      res.status(400).render("auth/sign-in.hbs", {
        errorMessage: "Ya existe un usuario con el mismo username",
      });
      return;
    }
    //aquí ciframos la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    //se crea el user

    await User.create({
      username: username,
      password: passwordHash,
    });

    console.log("password crypt", passwordHash),
      //finalmente redirigimos a la home
      res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    //buscar user con ese correo en la DB
    const foundUser = await User.findOne({ username: username });
    console.log(foundUser);

    if (foundUser === null) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "No existe ese nombre de usuario",
      });
      return; //detener la ruta
    }
    //comparar contraseña del formulario (password) con la cifrada de la DB (foundUser.password)
    const passwordOk = await bcrypt.compare(password, foundUser.password);
    console.log(passwordOk);

    if (passwordOk === false) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Contraseña no válida",
      });
      return; //detener la ruta
    }

    //ya hemos autenticado al user. Creamos sesión activa del usuario
    req.session.user = {
        _id: foundUser._id,
        username: foundUser.username
    }

    //guardamos en la sesión info del usuario que no va a cambiar
    //.save se invoca para esperar a que se cree la sesión
    req.session.save(() => {
        res.redirect("/user")
    })
    //! YA TENGO ACCESO AL REQ.SESSION EN CUALQUIER RUTA DE MI SERVIDOR


  } catch (error) {
    next(error)
  }
});

module.exports = router;
