const { get_dashboard } = require("./dashboard.controller");

const dashboardRouter = require("express").Router();

dashboardRouter.get("/", get_dashboard);

module.exports = dashboardRouter;
