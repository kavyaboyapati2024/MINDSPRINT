import express from "express";
import {
  createAuction,
  getOngoingAuctions,
  getUpcomingAuctions,
  getPastAuctions,
  getAuctionById,
  getAuctionImage
} from "../controllers/auctionControllers.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", upload.single("file"), createAuction);

router.get("/upcoming", getUpcomingAuctions);

router.get("/ongoing", getOngoingAuctions);

router.get("/past", getPastAuctions);

router.get("/:id", getAuctionById);

router.get("/:id/image", getAuctionImage);

export default router;
