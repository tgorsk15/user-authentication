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

app.get("/", (req, res) => res.render("index", {
    user: req.user
}))
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

app.post("/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
)

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
})

// set up local strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query(`
                SELECT * FROM users
                WHERE username = $1
            `, [username])
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "incorrect username" })
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user)

        } catch(err) {
            return done(err)
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM users
            WHERE id = $1
        `, [id]);
        const user = rows[0];

        done(null, user)
    } catch(err) {
        done(err)
    }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))

