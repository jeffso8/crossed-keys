var fs = require("fs");

export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function generateCards(words, colors) {
  const cards = [];
  return words.map((word, i) => {
    return { word, color: colors[i], isClicked: false };
  });
}

export function getWords() {
  const text = fs.readFileSync(__dirname + "/WORDS.txt", "utf-8");
  const words = text.split("\n");
  const shuffledArray = shuffle(words);
  return shuffledArray.splice(0, 25);
}

export function logErrors(err) {
  console.log(err);
  let d = new Date();
  var errorTime = d.toLocaleString();
  const newError = new ErrorLog({ foundErr: err.toString(), time: errorTime });
  newError.save();
}

export const newUser = (userID, isHost = false) => {
  return {
    [userID]: {
      team: null,
      role: null,
      host: isHost,
    },
  };
};
