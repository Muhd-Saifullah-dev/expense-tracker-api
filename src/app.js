const express = require("express");

const  { RedisStore } =require("connect-redis");
const redis =require("./shared/redis-client");

const session = require("express-session");
const app = express();

app.use(express.json());

app.use(
  session({
    store: new RedisStore({
      client: redis,
      prefix: "session:",
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.get("/health-check", (req, res) => {
  return res.status(200).json({ success: true, message: "server running up" });
});

module.exports = app;
