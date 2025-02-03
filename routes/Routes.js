import express from "express";
import { loginAdmin, createAdmin } from "../controllers/adminController.js";
import {
  getAllUsers,
  addUser,
  getUserWithId,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";

const Router = express.Router();

Router.get("/users", getAllUsers);
Router.get("/user/:id", getUserWithId);
Router.post("/user/add", addUser);
Router.put("/user/:id", updateUser);
Router.delete("/user/:id", deleteUser);
Router.post("/user/login", loginUser);

//For Dev use
Router.post("/admin/login", loginAdmin);
Router.post("/admin/create/", createAdmin);

export default Router;
