"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWords = getWords;
exports.newUser = void 0;

var _puppeteer = _interopRequireDefault(require("puppeteer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getWords() {
  return _getWords.apply(this, arguments);
}

function _getWords() {
  _getWords = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var URL, browser, page;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
            _context.next = 4;
            return _puppeteer["default"].launch({
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

          case 4:
            browser = _context.sent;
            _context.next = 7;
            return browser.newPage();

          case 7:
            page = _context.sent;
            _context.next = 10;
            return page["goto"](URL);

          case 10:
            _context.next = 12;
            return page.evaluate(function () {
              var words = Array.from(document.querySelectorAll('span.rand_large'));
              return words.map(function (word) {
                return word.innerText;
              });
            });

          case 12:
            return _context.abrupt("return", _context.sent);

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 17]]);
  }));
  return _getWords.apply(this, arguments);
}

var newUser = function newUser(userID) {
  var isHost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return _defineProperty({}, userID, {
    team: null,
    role: null,
    host: isHost
  });
};

exports.newUser = newUser;