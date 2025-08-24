import express from "express";
import {
  loginUser,
  updatePassword,
  registerUser,
  forgotPassword,
  logoutUser
} from "../controllers/userControllers.js";
import { protectRoute } from "../middlewares/jwtToken.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/update-password", protectRoute, updatePassword);

router.post("/forgot-password", forgotPassword);

router.post("/logout", logoutUser);

export default router;
