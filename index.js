const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

require('dotenv').config();

// DB connect
mongoose.connect(process.env.DB_KEY, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected to DB!'));

app.use(express.json());

// routes
app.use('/user', authRoute);
app.use('/post', postsRoute);

app.listen(3000, () => {
  console.log('listening at 3000');
});
