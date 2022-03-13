const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./app/api/v1/users/router");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const apiVersion = "/api/v1";

app.use(`${apiVersion}/users`, usersRouter);

module.exports = app;
