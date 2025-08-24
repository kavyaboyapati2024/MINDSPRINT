import Auction from "../models/auctionModel.js";

//create an auction
export const createAuction = async (req, res) => {
  try {
    const { title, description, basePrice, minIncrement, auctionDate, startTime, endTime } = req.body;

    if (!title || !description || !basePrice || !minIncrement || !auctionDate || !startTime || !endTime) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (!req.file) return res.status(400).json({ error: "Image file is required" });

    const fileBase64 = req.file.buffer.toString("base64");

    // Convert auctionDate + startTime / endTime to UTC Date objects
    const startDateTime = new Date(`${auctionDate}T${startTime}:00`);
    const endDateTime = new Date(`${auctionDate}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    const auction = new Auction({
      title,
      description,
      basePrice,
      minIncrement,
      startDateTime,
      endDateTime,
      file: fileBase64,
    });

    await auction.save();

    return res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Upcoming Auctions
export const getUpcomingAuctions = async (req, res) => {
  try {
    const upcoming = await Auction.find({ status: "upcoming" });
    return res.status(200).json({ upcoming });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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

// Get Past Auctions
export const getPastAuctions = async (req, res) => {
  try {
    const past = await Auction.find({ status: "past" });
    return res.status(200).json({ past });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
