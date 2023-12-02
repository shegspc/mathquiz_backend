//import { validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {isValidEmail, isValidText} from "../utils/validation.js"

// Register new user
export const register = async (req, res, next) => {
  // Fetch data posted to the 'register' route
  const data = req.body;
  // Create an empty error object
  let errors = {};
  // Validation Steps:
  // Step one: check if email is valid
  if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email!';
  } else {
  // Step two: if email is valid check, if an existing user already has the same email
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        errors.email = 'Email already exists.';
      }
    } catch (error) {}
  }
  // Step three: check if password is at least 6 characters long
  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.';
  }
 // If error(s) exist return the errors to the user...
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }else{
    // Else create new user 
    const email = data.email;
    const name = data.name;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    const newUser = new User({
      email: email,
      password: hash,
      name: name
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
     next(err);
  }
  }
}

// Login an existing user
export const login = async (req, res, next) => {
  try {
    // request if email is in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    // compare the user password with incoming request password 
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or email!"));

      // give user acess to the site "to sign user in"
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      // status 200 means no error and acess is been granted as a user
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
