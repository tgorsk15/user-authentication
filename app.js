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
    database: "tyler15",
    password: "Kfkenny13!!",
    port: 5432 // the default port
})

const app = express();
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false}))
app.use(passport.session());
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => res.render("index"))
app.get("/sign-up", (req, res) => res.render("sign-up"))

app.post("/sign-up", async (req, res, next) => {
    try {
        await pool.query(`
            INSERT INTO users (username, password)
            VALUES
                ($1, $2)
        `, [req.body.username, req.body.password])
        res.redirect("/");
    } catch(err) {
        return next(err)
    }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))

