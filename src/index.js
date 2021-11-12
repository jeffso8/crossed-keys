import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import Rooms from "../models/Rooms";
import ErrorLog from "../models/ErrorLog";
import database from "../database/index";
import "regenerator-runtime/runtime.js";
import { getWords, logErrors, newUser } from "./utils";
import { loadSockets } from "./sockets";
import path from "path";

const socketIO = require("socket.io");
const port = process.env.PORT || 3001;

let app = express();
let server = http.Server(app);
let io = socketIO(server);

// Redirect to https
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

app.options("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.sendStatus(200);
});

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/*
 roomMap: {
  roomID: {
    spymasterHints: String[],
    colors: String[],
    words: String[],
    clicked: Boolean[],
    isRedTurn: Boolean,
    totalGameScore: [int, int],
    redScore: int
    blueScore: int,
    redSpy: String,
    blueSpy: String,
    users: {
      userID[]: {
        team: String,
        role: String,
        isHost: Boolean,
      }
    }
  }
 }
*/

app.get("/words", async (req, res) => {
  const words = await getWords();
  return res.send(words);
});

app.post("/create-room", (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomName}`,
  });
});

app.get("/game-stats", function (req, res) {
  Rooms.findOne({ roomID: req.roomID }, function (err, foundRoom) {
    if (!err) {
      res.send(foundRoom);
    } else {
      console.log(err);
    }
  });
});

// Handle React routing, return all requests to React app
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

loadSockets(server);

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
