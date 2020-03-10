const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test1@test.com',
    password: '1111'
  }
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError('Fetch users failed, please try again later.', 500));
  }

  res.json({
    users: users.map(u => u.toObject({ getUsers: true }))
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422));
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    places
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      `Signing up failed, please try again. Err: ${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(new HttpError('Logging in failed, please try again later.', 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Invalid credentials, could not log you in.', 401));
  }

  res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
