import express from "express"
import {
    placeBid,
    getBidsByAuction,
    getbidderid
} from "../controllers/bidControllers.js"
import { protectRoute } from "../middlewares/jwtToken.js";
const router = express.Router();

router.post("/place-bid", placeBid)
router.post("/get-bids-by-id/:auctionId", getBidsByAuction)
router.get("/get-bidder-id",protectRoute, getbidderid)
export default router;