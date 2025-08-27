import Auction from "../models/auctionModel.js";
import Auctioner from "../models/auctionerModel.js";

//create an auction
export const createAuction = async (req, res) => {
  try {
    const {
      auctionerId,
      title,
      description,
      basePrice,
      startDateTime,
      endDateTime,
    } = req.body;

    // ✅ Validate required fields
    if (
      !auctionerId ||
      !title ||
      !description ||
      !basePrice ||
      !startDateTime ||
      !endDateTime
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // ✅ Convert image buffer to base64
    const fileBase64 = req.file.buffer.toString("base64");

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    // ✅ Create auction document
    const auction = new Auction({
      auctionerId, // 🔹 Added auctionerId
      title,
      description,
      basePrice,
      startDateTime: start,
      endDateTime: end,
      file: fileBase64,
    });

    await auction.save();

    return res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Upcoming Auctions
export const getUpcomingAuctions = async (req, res) => {
  try {
    const upcomingAuctions = await Auction.find({
      status: "upcoming",
    }).populate("auctionerId", "name");

    const formatted = upcomingAuctions.map((auction) => {
      const startDate = new Date(auction.startDateTime);
      const endDate = new Date(auction.endDateTime);

      // Format as DD-MM-YYYY HH:MM
      const startTime = `${startDate.getDate().toString().padStart(2, "0")}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-${startDate.getFullYear()} ${startDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const endTime = `${endDate.getDate().toString().padStart(2, "0")}-${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-${endDate.getFullYear()} ${endDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      return {
        _id: auction._id,
        title: auction.title,
        auctioneer: auction.auctionerId?.name || "Unknown",
        startTime, // ✅ Date + Time
        endTime, // ✅ Date + Time
        baseAmount: auction.basePrice || 0,
      };
    });

    res.json({ upcoming: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Ongoing Auctions
export const getOngoingAuctions = async (req, res) => {
  try {
    const ongoing = await Auction.find({ status: "ongoing" });
    return res.status(200).json({ ongoing });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Get Past auctions
export const getPastAuctions = async (req, res) => {
  try {
    // Find past auctions and populate auctioner name
    const pastAuctions = await Auction.find({ status: "past" }).populate(
      "auctionerId",
      "name"
    );

    // Example winning bids array (randomized)
    const winningBids = ["₹180000", "₹200000", "₹220000", "₹250000", "₹300000"];

    // Format response
    const formatted = pastAuctions.map((auction, index) => ({
      _id: auction._id,
      title: auction.title,
      auctioneer: auction.auctionerId?.name || "Unknown",
      completionDate: auction.endDateTime.toISOString().split("T")[0],
      winningBid: winningBids[index % winningBids.length], // cycle through array
    }));

    res.json({ past: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    // populate only existing fields on Auctioner (here: name)
    const auction = await Auction.findById(id)
      .select("-file") 
      .populate("auctionerId", "name")
      .lean();

    if (!auction) return res.status(404).json({ error: "Auction not found" });

    return res.status(200).json(auction);
  } catch (err) {
    console.error("getAuctionById error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getAuctionImage = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id).select("file");
    if (!auction || !auction.file) {
      return res.status(404).send("No image found");
    }
    const imgBuffer = Buffer.from(auction.file, "base64");
    res.set("Content-Type", "image/jpeg");
    res.send(imgBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

