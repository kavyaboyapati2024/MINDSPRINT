// controllers/bidController.js
import Auction from "../models/auctionModel.js"

import AuctionerKey from "../models/auctionerKeyModel.js";

// TO store thr encrypted amount in the mongo db
export const placeBid = async (req, res) => {
  try {
    const { auctionId, userId, encryptedAmount, iv, bidHash } = req.body;

    // Validate input
    if (!auctionId || !userId || !encryptedAmount || !iv) {
      return res.status(400).json({
        error: "auctionId, userId, encryptedAmount, and iv are required",
      });
    }

    // Find the auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    // Check auction timing
    const now = new Date();
    if (now < auction.startDateTime) {
      return res.status(400).json({ error: "Auction has not started yet" });
    }
    if (now > auction.endDateTime) {
      return res.status(400).json({ error: "Auction has already ended" });
    }

    // Store ciphertext + IV (not plaintext)
    const bid = new Bid({
      auctionId,
      userId,
      encryptedAmount, // ciphertext from frontend
      iv,              // IV from frontend
      bidHash: bidHash || null, // optional integrity hash
    });

    await bid.save();

    return res
      .status(201)
      .json({ message: "Sealed bid placed successfully", bid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all bids placed in a auction
export const getBidsByAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId) {
      return res.status(400).json({ error: "auctionId is required" });
    }

    // Select only userId and encryptedAmount
    const bids = await Bid.find({ auctionId }).select("userId encryptedAmount -_id");

    return res.status(200).json({
      message: "Bids fetched successfully",
      count: bids.length,
      bids,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get the bidder key so that the bid msg can be unlocked after auction is complete
export const getBidderKey = async (req, res) => {
  try {
    const { auctionId, userId } = req.params;

    if (!auctionId || !userId) {
      return res.status(400).json({ error: "auctionId and userId are required" });
    }

    // Step 1: Fetch the key from AuctionerKey collection
    const auctionerKey = await AuctionerKey.findOne({ auctionId, userId });
    if (!auctionerKey) {
      return res.status(404).json({ error: "No key found for this user in the auction" });
    }

    // Step 2: Check if the user actually placed a bid in this auction
    const bid = await Bid.findOne({ auctionId, userId });
    if (!bid) {
      return res.status(404).json({ error: "No bid found for this user in the auction" });
    }

    return res.status(200).json({
      message: "Key fetched successfully",
      auctionId,
      userId,
      key: auctionerKey.key,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getbidderid = async(req, res) => {
  try {
    // req.user is populated by protectRoute middleware
    res.status(200).json({ userId: req.user._id });
  } catch (err) {
    console.error("Error getting bidder ID:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};