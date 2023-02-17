const mongoose = require('mongoose');
//require("dotenv").config();

//Connect to database
const url =
  'mongodb+srv://zothanizulu:2580456@cluster0.pisqo1b.mongodb.net/adopt_a_pet';
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log('Connected to MongoDB');
    } else {
      console.log(err);
    }
  }
);