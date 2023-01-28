import Rooms from "../models/Rooms";
import { generateCards, getWords, logErrors, newUser } from "./utils";

const socketIO = require("socket.io");

export function loadSockets(server) {
  let io = socketIO(server);

  const colors = [
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "black",
  ];

  io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      //data is an object with the roomID and the user that joined the room
      socket.join(data.roomID);
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        if (!res) {
          const newRoom = new Rooms({
            roomID: data.roomID,
            totalGameScore: [0, 0],
            users: [
              {
                userID: data.userID,
                team: null,
                role: null,
                isHost: true,
                socketId: socket.id,
              },
            ],
          });
          if (err) {
            return;
          }
          newRoom.save();
          io.in(data.roomID).emit("updateTeams", newRoom);
        } else {
          const foundUser = res.users.find(
            (user) => user.userID === data.userID
          );

          if (!foundUser) {
            res.users.push({
              userID: data.userID,
              team: null,
              role: null,
              isHost: false,
              socketId: socket.id,
            });
          }

          if (err) {
            logErrors(err);
            return;
          }

          res.markModified("users");
          res.save();
          io.in(data.roomID).emit("updateTeams", res);
        }
      });
    });

    socket.on("newHint", (data) => {
      Rooms.findOneAndUpdate(
        { roomID: data.roomID },
        {
          $addToSet: {
            hints: {
              hint: data.hint,
              hintCount: data.hintCount,
              isRedTurn: data.isRedTurn,
            },
          },
        },
        { upsert: true, new: true },
        function (err, res) {
          if (err) return;
          socket.nsp.in(data.roomID).emit("sendHint", res);
        }
      );
    });

    socket.on("setRedTeam", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        const foundUser = res.users.find((user) => user.userID === data.userID);
        foundUser.team = "RED";
        foundUser.role = null;
        if (res.blueSpy == data.userID) {
          res.blueSpy = null;
        }
        res.markModified("users", "blueSpy");
        res.save();
        socket.nsp.in(data.roomID).emit("updateTeams", res);
      });
    });

    socket.on("setBlueTeam", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        const foundUser = res.users.find((user) => user.userID === data.userID);
        foundUser.team = "BLUE";
        foundUser.role = null;
        if (res.redSpy == data.userID) {
          res.redSpy = null;
        }
        res.markModified("users", "redSpy");
        res.save();
        socket.nsp.in(data.roomID).emit("updateTeams", res);
      });
    });

    socket.on("claimSpyMaster", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        const foundUser = res.users.find((user) => user.userID === data.userID);
        const prevUser = res.users.find((user) => user.role === "MASTER");
        if (prevUser) {
          prevUser.role = null;
        }
        foundUser.role = "MASTER";
        if (foundUser.team === "RED") {
          res.redSpy = foundUser.userID;
        } else if (foundUser.team === "BLUE") {
          res.blueSpy = foundUser.userID;
        }
        res.markModified("users", "redSpy", "blueSpy");
        res.save();
        socket.nsp.in(data.roomID).emit("updateTeams", res);
      });
    });

    socket.on("joinGame", (data) => {
      console.log("join");
      socket.join(data.roomID);
      Rooms.findOneAndUpdate(
        { roomID: data.roomID, "users.userID": data.user.userID },
        { $set: { "users.$.socketId": socket.id } },
        { upsert: true, new: true },
        function (err, res) {
          if (err) return;
          socket.nsp.in(data.roomID).emit("refreshGame", res);
        }
      );
    });

    socket.on("redScoreChange", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        if (err) return;
        res.redScore = data.redScore;
        res.markModified("redScore");
        res.save();
        socket.nsp
          .in(data.roomID)
          .emit("updateRedScore", { redScore: res.redScore });
      });
    });

    socket.on("blueScoreChange", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        if (err) return;
        res.blueScore = data.blueScore;
        res.markModified("blueScore");
        res.save();
        socket.nsp
          .in(data.roomID)
          .emit("updateBlueScore", { blueScore: res.blueScore });
      });
    });

    socket.on("updateTurn", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        if (err) return;
        res.isRedTurn = data.redTurn;
        res.turnEndTime = new Date().getTime() + 10000 + 1000;
        res.markModified("isRedTurn", "turnEndTime");
        res.save();
        socket.nsp.in(data.roomID).emit("redTurn", {
          redTurn: res.isRedTurn,
          turnEndTime: res.turnEndTime,
        });
      });
    });

    socket.on("gameOver", (data) => {
      Rooms.findOne({ roomID: data.roomID }, function (err, res) {
        if (err) return;
        clearInterval(data.timerID);
        res.totalGameScore = data.gameScore;
        res.gameOver = data.gameOver;
        res.redScore = data.redScore;
        res.blueScore = data.blueScore;
        res.markModified("gameScore", "gameOver", "redScore", "blueScore");
        res.save();
        socket.nsp.in(data.roomID).emit("updateGameOver", res);
      });
    });

    socket.on("hostStartGame", (data) => {
      const colorSorted = colors.sort(() => Math.random() - 0.5);
      const words = getWords();

      const cards = generateCards(words, colorSorted);

      const clicked = new Array(25).fill(false);
      socket.roomID = data.roomID;
      Rooms.findOneAndUpdate(
        { roomID: data.roomID },
        {
          $set: {
            cards,
            colors: colorSorted,
            words: words,
            clicked: clicked,
            isRedTurn: true,
            redScore: 8,
            blueScore: 8,
            gameOver: false,
            hints: [],
            turnEndTime: new Date().getTime() + 10000 + 1000,
          },
        },
        { upsert: true, new: true },
        function (err, res) {
          console.log("err", err);
          if (err) return;
          console.log("startgame", res);
          socket.nsp.in(data.roomID).emit("startGame", res);
        }
      );
    });

    socket.on("flipCard", async (data) => {
      console.log("flipCard", data);
      const { cards } = await Rooms.findOne({ roomID: data.roomID }, "cards")
        .lean()
        .exec();

      cards[data.index].isClicked = true;
      await Rooms.updateOne({ roomID: data.roomID }, { $set: { cards } });

      socket.nsp.in(data.roomID).emit("updateFlipCard", {
        isRedTurn: data.isRedTurn,
        // clicked: res.clicked,
        cards,
      });

      // Rooms.findOne({ roomID: data.roomID }, function (err, res) {
      //   if (err) return;
      //   console.log("res", res.cards, res.cards[0]);
      //   res.cards[data.index].isClicked = true;
      //   // res.clicked[data.index] = true;
      //   res.isRedTurn = data.isRedTurn;
      //   res.markModified("cards", "isRedTurn");
      //   res.save();
      //   socket.nsp.in(data.roomID).emit("updateFlipCard", {
      //     isRedTurn: res.isRedTurn,
      //     clicked: res.clicked,
      //     cards: res.cards,
      //   });
      // });
    });

    socket.on("getWords", (data) => {
      Rooms.findOneAndUpdate(
        { roomID: data.roomID },
        { $set: { words: getWords() } },
        { upsert: true, new: true },
        function (err, result) {
          if (err) return;
          socket.nsp.in(data.roomID).emit("sendWords", result);
        }
      );
    });
  });
}
