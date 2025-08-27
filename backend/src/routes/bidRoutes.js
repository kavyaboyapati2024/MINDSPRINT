import express from "express"
import {
    placeBid,
    getBidsByAuction
} from "../controllers/bidControllers.js"

const router = express.Router();

router.post("/place-bid", placeBid)
router.post("/get-bids-by-id/:auctionId", getBidsByAuction)

export default router;