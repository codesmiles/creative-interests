const { Router } = require("express");
const app = Router();


const cliRoutes = require("./routes/cli");
const mailchimp_api_routes = require("./routes/api/mailchimp");

// routes
app.use("/cli", cliRoutes);
app.use("/api", mailchimp_api_routes);


module.exports = app;
