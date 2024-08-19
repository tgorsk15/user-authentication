///// app.js
const { Pool }= require("pg");
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy


//// pool.js
const pool = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: "tyler15",
    database: "users",
    password: "Kfkenny13!!",
    port: 5432 // the default port
})

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(session({ secret: "cats", resave: false, saveUninitialized: false}))
app.use(passport.session());

app.get("/", (req, res) => res.render("index"))
app.get("/sign-up", (req, res) => res.render("sign-up"))

app.use(express.urlencoded({ extended: false }))


const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))

