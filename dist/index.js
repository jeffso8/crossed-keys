"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _Rooms = _interopRequireDefault(require("../models/Rooms"));

var _ErrorLog = _interopRequireDefault(require("../models/ErrorLog"));

var _index = _interopRequireDefault(require("../database/index"));

require("regenerator-runtime/runtime.js");

var _utils = require("./utils");

var _sockets = require("./sockets");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var socketIO = require('socket.io');

var port = process.env.PORT || 3001;
var app = (0, _express["default"])();

var server = _http["default"].Server(app);

var io = socketIO(server); // Redirect to https

app.use(function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect("https://".concat(req.header('host')).concat(req.url));
    } else {
      next();
    }
  } else {
    next();
  }
});
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../client/build')));
app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});
app.all('*', function (req, res, next) {
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

app.get('/words', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var words;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.getWords)();

          case 2:
            words = _context.sent;
            return _context.abrupt("return", res.send(words));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/create-room', function (req, res) {
  return res.status(200).json({
    success: true,
    redirectUrl: "/".concat(req.body.roomName)
  });
});
app.get('/game-stats', function (req, res) {
  _Rooms["default"].findOne({
    roomID: req.roomID
  }, function (err, foundRoom) {
    if (!err) {
      res.send(foundRoom);
    } else {
      console.log(err);
    }
  });
}); // Handle React routing, return all requests to React app

app.get('/*', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, '../client/build', 'index.html'));
});
(0, _sockets.loadSockets)(server);
server.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});