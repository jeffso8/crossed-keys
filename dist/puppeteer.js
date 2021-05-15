"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
            console.log("start pup");
            URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
            _context.next = 5;
            return _puppeteer["default"].launch({
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              headless: false
            });

          case 5:
            browser = _context.sent;
            console.log("pre browser");
            _context.next = 9;
            return browser.newPage();

          case 9:
            page = _context.sent;
            console.log("browser");
            _context.next = 13;
            return page["goto"](URL);

          case 13:
            _context.next = 15;
            return page.evaluate(function () {
              var words = Array.from(document.querySelectorAll('span.rand_large'));
              var result = words.map(function (word) {
                return word.innerText;
              });
              console.log(result);
              return result;
            });

          case 15:
            return _context.abrupt("return", _context.sent);

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 20]]);
  }));
  return _getWords.apply(this, arguments);
}

function assembleList() {
  var assembled = [];
  var filtered = set();

  for (var i = 0; i < 30; i++) {
    assembled.append(getWords());
  }

  ;
  assembled.sort();
  assembled.forEach(function (element) {
    if (element.slice(-1) == 's') {
      singular = element.slice(0, -1);

      if (!filtered.has(singular)) {
        filtered.add(element);
      }
    }
  });
  filtered.forEach(function (element) {
    _fs["default"].appendFile('words.txt', element, function (err) {
      if (err) {
        console.log("error thrown");
      } else {
        console.log("saved!");
      }
    });
  });
}