require("dotenv").config();
const express = require("express");
const expressStatusMonitor = require("express-status-monitor");
const app = express();
const cliRoutes = require("./routes/cli");
const apiRoutes = require("./routes/api");

// Connect to MongoDB.

// Middlewares & configs setup
app.use(
  express.urlencoded({ extended: true }),
  express.json({ limit: "100mb" })
);
app.disable("x-powered-by");
app.use(expressStatusMonitor());

// routes
app.use("/cli", cliRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.json({ status: "OK", message: "Welcome" }));

// use fs module and file to access files
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname + "/tests/step3/invalid.json");
const file = fs.readFileSync(filePath, "utf8");

const parse_json = (data) => {
  if (data === "") return {};

  if (data === "[]" || data === "{}" || data === "null")
    return JSON.parse(data);

  if (data[0] === "'") return data.slice(1, -1);

  if (data[data.length - 2] === ",") return data.slice(0, -2) + data.slice(-1);

  // const unquoted_keys = /(?<=\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
  // data = data.replace(unquoted_keys, '"$1":');;

  return data.trim().slice(1, -1).split(" ").join("");
  return data
    .slice(1, -1)
    .split(",")
    .map((el, i, arr) => {
      arr[i] = el.split(": ")[1].toLowerCase();
      return arr;
    });
};
// console.log(parse_json(file));

const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || "localhost";
app.listen(port, () =>
  console.log(`Server running on http://${address}:${port}`)
);
