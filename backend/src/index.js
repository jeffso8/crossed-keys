import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import "regenerator-runtime/runtime.js";

const port = process.env.PORT || 3001;

let app = express();
app.use(cors());
app.use(express.json());

app.options("/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

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
let roomMap = {};

const newUser = (userID, isHost = false) => {
  return {
    [userID]: {
      team: null,
      role: null,
      host: isHost,
    }
  };
}

const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue",
"blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];


let server = http.createServer(app);

let io = socketIO(server, {
  cors: true,
  origins:['http://127.0.0.1:3000'],
});
let interval;

async function getWords() {
	try {
		const URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

    await page.goto(URL);
    return await page.evaluate(() => {
      const words = Array.from(document.querySelectorAll('span.rand_large'));
      return words.map(word => {
        return word.innerText;
      })
    });
		await browser.close()
	} catch (error) {
		console.error(error)
	}
}


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/words', async (req, res) => {
  const words = await getWords();
  return res.send(words);
});

app.post('/create-room', (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomName}`
  });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    //data is an object with the roomID and the user that joined the room
    socket.join(data.roomID);
    if (!roomMap[data.roomID]) {
      // Create new room with new user
      roomMap[data.roomID] = {users:
        newUser(data.userID, true)
      };
    } else {
      // adding new users to the room
      let users = roomMap[data.roomID]['users'];
      if (!users[data.userID]) {
        const newUserObj = newUser(data.userID);
        let updatedUsers = {
          ...users,
          ...newUserObj,
        };
        roomMap[data.roomID]['users'] = updatedUsers;
      }
    }
    io.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on('message', (data) => {
    //gives data as an object {message: what message was sent, roomId: has the given room id}
    socket.nsp.in(data.roomID).emit('newMessage', data.message);
    console.log('data', data.roomID);
    console.log(io.sockets.adapter.clients);
  });

  socket.on('getWords', (data) => {
    if (!roomMap[data.roomID].words) {
      roomMap[data.roomID].words = getWords();
    };
    socket.nsp.in(data.roomID).emit('sendWords', roomMap[data.roomID].words);
  });

  socket.on('setRedTeam', (data) => {
    roomMap[data.roomID]["users"][data.userID]["team"] = "RED";
    roomMap[data.roomID]["users"][data.userID]["role"] = null;
    if(roomMap[data.roomID]['blueSpy'] === data.userID) {
      delete roomMap[data.roomID]['blueSpy'];
    }
    console.log('sET', socket.nsp.in(data.roomID));
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on('setBlueTeam', (data) => {
    roomMap[data.roomID]["users"][data.userID]["team"] = "BLUE";
    roomMap[data.roomID]["users"][data.userID]["role"] = null;
    if(roomMap[data.roomID]['redSpy'] === data.userID) {
      delete roomMap[data.roomID]['redSpy'];
    }
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on('claimSpyMaster', (data) => {
    roomMap[data.roomID]['users'][data.userID]["role"] = "MASTER";
    if (roomMap[data.roomID]['users'][data.userID]["team"] === "RED") {
      roomMap[data.roomID]["redSpy"] = data.userID;
    } else if (roomMap[data.roomID]['users'][data.userID]["team"] === "BLUE"){
      roomMap[data.roomID]["blueSpy"] = data.userID;
    }
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on('joinGame', (data) => {
    socket.join(data.roomID);
  });

  socket.on('redScoreChange', (data) => {
    socket.nsp.in(data.roomID).emit('updateRedScore', {redScore: data.gameScore})
  });

  socket.on('blueScoreChange', (data) => {
    socket.nsp.in(data.roomID).emit('updateBlueScore', {blueScore: data.gameScore})

  });

  socket.on('hostStartGame', async (data) => {
    const colorSorted = colors.sort(() => Math.random() - 0.5);
    const words = await getWords();
    socket.nsp.in(data.roomID).emit('startGame', {roomID: data.roomID, users: roomMap[data.roomID]['users'], colors: colorSorted, words: words,
    redSpy: roomMap[data.roomID]['redSpy'], blueSpy: roomMap[data.roomID]['blueSpy']});

  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);