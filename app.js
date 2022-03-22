const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const cors = require("cors");

const authRouter = require("./app/api/v1/auth/router");
const categoryRouter = require("./app/api/v1/category/router");
const speakerRouter = require("./app/api/v1/speaker/router");
const eventRouter = require("./app/api/v1/event/router");
const usersRouter = require("./app/api/v1/users/router");

const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handle-error");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const apiVersion = "/api/v1";

app.use(`${apiVersion}/auth`, authRouter);
app.use(`${apiVersion}/category`, categoryRouter);
app.use(`${apiVersion}/speaker`, speakerRouter);
app.use(`${apiVersion}/event`, eventRouter);
app.use(`${apiVersion}/users`, usersRouter);

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
