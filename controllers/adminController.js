import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res, next) => {
  console.log("this is the Login Admin Function");
  let { email, password } = req.body;

  if (!email && email === "" && !password && password === "") {
    console.log("email or passowrd is invalid");
    return res.status(422).json({ message: "Invalid data" });
  }
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingAdmin) {
    return res
      .status(404)
      .json({ message: "unable to find an Admin with this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );
  console.log("Border crossed. Is the password correct? ", isPasswordCorrect);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // Need to establish the JWT for more security.

  return res
    .status(201)
    .json({ message: "loggedIn", id: existingAdmin.id, role: "admin" });
};

// ****************************************************

export const createAdmin = async (req, res, next) => {
  console.log("Creating a new admin...");
  let { email, password } = req.body;

  if (!email || !password) {
    console.log("Invalid email or password");
    return res.status(422).json({ message: "Invalid data" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }

  // Hash password before saving
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newAdmin = new Admin({
    email,
    password: hashedPassword,
  });

  try {
    await newAdmin.save();
    return res
      .status(201)
      .json({ message: "Admin created successfully", id: newAdmin._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error saving admin" });
  }
};
