const mongoose = require("../database");
const { Schema } = require("../database");

/*
 roomMap: {
  roomID: {
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
const RoomSchema = new mongoose.Schema(
  {
    roomID: String,
    colors: Array,
    words: Array,
    clicked: Array,
    isRedTurn: Boolean,
    gameOver: Boolean,
    totalGameScore: Array,
    redScore: Number,
    blueScore: Number,
    redSpy: String,
    blueSpy: String,
    users: Array,
    hints: [{ hint: String, hintCount: Number }],
    turnEndTime: Number,
  },
  {
    versionKey: false,
  }
);

const Rooms = mongoose.model("Rooms", RoomSchema);
module.exports = Rooms;
