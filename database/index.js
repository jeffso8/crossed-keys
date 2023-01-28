const mongoose = require("mongoose");

const uri =
  "mongodb+srv://protectyaneck:protectyaneck@cluster0.z0kxq.mongodb.net/roomDB";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));

const database = mongoose;

module.exports = database;
