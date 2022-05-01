const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidation } = require('../validation');
const { loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');

router.post('/login', async (req, res) => {
  console.log('You get a request!');
  console.log(req.body);

  // VALIDATE THE REQUEST
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if the user is the user already in the database // use findOne()
  const validEmail = await User.findOne({ email: req.body.email });
  if (!validEmail) return res.status(400).send('Wrong Email');

  // IS PASSWORD CORRECT? // USING AWAIT BECRYPT COMPARE
  const validPass = await bcrypt.compare(req.body.password, validEmail.password);
  // console.log(validPass);
  if (!validPass) return res.status(400).send('Wrong Password');

  // Create and assign a token
  const token = jwt.sign({ _id: validEmail._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  // res.send('logged in!');
});

router.post('/register', async (req, res) => {
  console.log('You get a request!');
  console.log(req.body);

  // VALIDATE THE REQUEST BEFORE SEND IT TO DATABASE
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if the user is the user already in the database // use findOne()
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email aready exist!');

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save(); // promise

    res.json({
      message: 'success',
      user: savedUser,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
