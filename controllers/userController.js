import User from "../models/User.js";
import bcrypt from "bcryptjs";

// All the controller functions related to the user.

// ****************************************************

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return next(err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }

  return res.status(200).json({ users });
};

// ****************************************************

export const getUserWithId = async (req, res, next) => {
  console.log("get user with id function triggered");

  // Get the ID from req.params (since it's passed in the URL)
  const { id } = req.params;

  let user;
  try {
    // Assuming User.findById is the correct method to find a user by ID
    user = await User.findById(id);
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};
// ****************************************************

export const addUser = async (req, res, next) => {
  const { name, email, password, mobileNumber } = req.body;
  if (
    !name &&
    name === "" &&
    !email &&
    email === "" &&
    !password &&
    password === "" &&
    !mobileNumber &&
    mobileNumber === ""
  ) {
    return res.status(422).json({ message: "Invalid data" });
  }

  let user;
  const cryptedPassword = bcrypt.hashSync(password);
  try {
    user = new User({ name, email, password: cryptedPassword, mobileNumber });
    user = await user.save();
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Internal Error" });
  }

  return res.status(201).json({ user });
};

// ****************************************************

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password, mobileNumber } = req.body;
  if (
    !name &&
    name === "" &&
    !email &&
    email === "" &&
    !password &&
    password === "" &&
    !mobileNumber &&
    mobileNumber === ""
  ) {
    return res.status(422).json({ message: "Invalid data" });
  }

  let user;
  const cryptedPassword = bcrypt.hashSync(password);
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: cryptedPassword,
      mobileNumber,
    });
  } catch (err) {
    return next(err);
  }
  console.log(user, "it is the new user details");
  if (!user) {
    return res.status(500).json({ message: "Internal Error" });
  }

  return res.status(201).json({ user });
};

// ****************************************************

export const deleteUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "unable to delete" });
  }
  if (!user) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(201).json({ message: "deleted" });
};

// ****************************************************

export const deleteAllUsers = async (req, res, next) => {
  console.log("deleteAllusers function triggered");
  try {
    await User.deleteMany({});
    return res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete all users" });
  }
};

// ****************************************************

export const loginUser = async (req, res, next) => {
  console.log("the login function has been triggered");
  let { email, password } = req.body;
  console.log(email, password);
  if (!email && email === "" && !password && password === "") {
    return res.status(422).json({ message: "Invalid data" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "unable to find user with this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res.status(201).json({
    message: "loggedIn",
    id: existingUser.id,
    role: "user",
    name: existingUser.name,
  });
};
