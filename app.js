// built-in package

// 3rd-party package
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// custom package
const route = require("./api/routes");
const dataSource = require("./api/models/dataSource");
const { globalErrorHandler } = require("./api/utils/error");

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(route);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

app.get("/ping", async (req, res) => {
  return res.status(200).json({ message: "pong!" });
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});
