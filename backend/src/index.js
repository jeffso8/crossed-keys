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
    words: String[],
    userID: {
      team: String,
      role: String
    }
  }
 }
*/
let roomMap = {};

const newUser = (userID) => {
  return {
    [userID]: {
      team: null,
      role: null,
    }
  };
}

let server = http.createServer(app);

let io = socketIO(server, {
  cors: true,
  origins:['http://127.0.0.1:3000'],
});
let interval;

async function getWords() {
  console.log('GET VISUAL');

	try {
		const URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

    await page.goto(URL);
    // const bodyHandle = await page.$('ol');
    // const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    // console.log('bodyhandle', html);

    return await page.evaluate(() => {
      const words = Array.from(document.querySelectorAll('span.rand_large'));
      return words.map(word => {
        return word.innerText;
      })
    });
    // console.log('data', data);
		//await page.screenshot({ path: 'screenshot.png' })
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

app.post('/start-game', (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomID}/game`
  });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    //data is an object with the roomID and the user that joined the room
    socket.join(data.roomID);
    if (!roomMap[data.roomID]) {
      // Create new room with new user
      roomMap[data.roomID] = newUser(data.userID);
      console.log('roommap', roomMap);
    } else {
      // adding new users to the room
      let users = roomMap[data.roomID];
      console.log('users', users);
      const newUserObj = newUser(data.userID);
      let updatedUsers = {
        ...users,
        ...newUserObj,
      };
      roomMap[data.roomID] = updatedUsers;
      // users.push({userID: data.userID, team: null});
      // roomMap.set(data.roomID, users)
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
    roomMap[data.roomID][data.userID]["team"] = "RED";
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

   socket.on('setBlueTeam', (data) => {
    roomMap[data.roomID][data.userID]["team"] = "BLUE";
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);