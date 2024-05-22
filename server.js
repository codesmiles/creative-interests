require("dotenv").config();
const express = require('express');
const expressStatusMonitor = require('express-status-monitor');
const app = express();
const cliRoutes = require('./routes/cli');

// Connect to MongoDB.

// Middlewares & configs setup
app.use(express.urlencoded({ extended: true }),express.json({limit:"100mb"}));
app.disable('x-powered-by');
app.use(expressStatusMonitor());

// routes
app.use("/cli", cliRoutes);

const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || 'localhost';

app.get('/', (req, res) => res.json({status: 'OK', message: 'Welcome'}));



app.listen(port, () => console.log(`Server running on http://${address}:${port}`));