import jwt from "jsonwebtoken"; // Import jwt
import bcrypt from "bcryptjs"; // Ensure bcrypt is properly imported
import Admin from "../models/Admin.js"; // Your Admin model

export const loginAdmin = async (req, res, next) => {
  console.log("this is the Login Admin Function");
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Invalid data" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingAdmin) {
    return res
      .status(404)
      .json({ message: "Unable to find an Admin with this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: existingAdmin.id, role: "admin" }, // Payload
    process.env.JWT_SECRET, // Your secret key (store this in an environment variable)
    { expiresIn: "1h" } // Expiry time (optional)
  );

  // Send the token back to the client
  return res.status(201).json({
    message: "Logged in",
    token, // Send the token to the client
    role: "admin",
    id: existingAdmin.id,
  });
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
