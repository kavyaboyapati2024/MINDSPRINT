import express from "express";
import {
  registerAuctioner,
  loginAuctioner,
  updateAuctionerPassword,
  forgotAuctionerPassword,
  logoutAuctioner,
  getAuctionerById,
} from "../controllers/auctionerControllers.js";
import { protectRoute } from "../middlewares/jwtToken.js";

const router = express.Router();

router.get('/:id', getAuctionerById);

router.post("/register", registerAuctioner);

router.post("/login", loginAuctioner);

router.post("/update-password", protectRoute, updateAuctionerPassword);

router.post("/forgot-password", forgotAuctionerPassword);

router.post("/logout", logoutAuctioner);



export default router;
