import express from 'express';
import {
  getAuctionReport,
  downloadAuctionReport
} from '../controllers/auctionReportControllers.js';

const router = express.Router();

router.get("/report/:auctionId", getAuctionReport);

router.get("/report/download/:auctionId", downloadAuctionReport);

export default router;

