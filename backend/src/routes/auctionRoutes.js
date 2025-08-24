import express from "express";
import {
  createAuction,
  getOngoingAuctions,
  getUpcomingAuctions,
  getPastAuctions,
} from "../controllers/auctionControllers.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", upload.single("file"), createAuction);

router.get("/upcoming", getUpcomingAuctions);

router.get("/ongoing", getOngoingAuctions);

router.get("/past", getPastAuctions);

export default router;
