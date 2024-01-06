require("dotenv").config(".env");

const express = require("express");
const app = express();

const initializeApp = require("./services/initializeService");

(async () => await initializeApp(app))();

module.exports = app;
