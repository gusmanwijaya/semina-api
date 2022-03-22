const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const cors = require("cors");

const authUserRouter = require("./app/api/v1/auth/user/router");
const authParticipantRouter = require("./app/api/v1/auth/participant/router");

const categoryRouter = require("./app/api/v1/category/router");
const speakerRouter = require("./app/api/v1/speaker/router");
const eventRouter = require("./app/api/v1/event/router");
const transactionRouter = require("./app/api/v1/transaction/router");

const participantRouter = require("./app/api/v1/participant/router");

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

app.use(`${apiVersion}/auth/user`, authUserRouter);
app.use(`${apiVersion}/auth/participant`, authParticipantRouter);

app.use(`${apiVersion}/category`, categoryRouter);
app.use(`${apiVersion}/speaker`, speakerRouter);
app.use(`${apiVersion}/event`, eventRouter);
app.use(`${apiVersion}/transaction`, transactionRouter);

app.use(`${apiVersion}/participant`, participantRouter);

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
