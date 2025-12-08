import Auction from "../models/auctionModel.js";
import Aucioner from "../models/auctionerModel.js"
import AuctionRegistration from "../models/auctionRegistrationModel.js";
import WinnerMail from "../models/winnerMailModel.js"
import Bid from "../models/bidModel.js"

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

// Update an auction
export const updateAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const {
      title,
      description,
      basePrice,
      startDateTime,
      endDateTime,
    } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    if (title) auction.title = title;
    if (description) auction.description = description;
    if (basePrice) auction.basePrice = basePrice;

    if (startDateTime) {
      const start = new Date(startDateTime);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ error: "Invalid start date format" });
      }
      auction.startDateTime = start;
    }

    if (endDateTime) {
      const end = new Date(endDateTime);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ error: "Invalid end date format" });
      }
      auction.endDateTime = end;
    }

    if (req.file) {
      const fileBase64 = req.file.buffer.toString("base64");
      auction.file = fileBase64;
    }

    await auction.save();

    return res.status(200).json({
      message: "Auction updated successfully",
      auction,
    });
  } catch (error) {
    console.error("Error updating auction:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete an auction
export const deleteAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findByIdAndDelete(auctionId);

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    return res.status(200).json({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting auction:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Upcoming Auctions
export const getUpcomingAuctions = async (req, res) => {
  try {
    const upcomingAuctions = await Auction.find({
      status: "upcoming",
    }).populate("auctionerId", "accountType fullName organizationName contactPersonName email");

    const formatted = upcomingAuctions.map((auction) => {
      const startDate = new Date(auction.startDateTime);
      const endDate = new Date(auction.endDateTime);

      // Format as DD-MM-YYYY HH:MM
      const startTime = `${startDate.getDate().toString().padStart(2, "0")}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${startDate.getFullYear()} ${startDate.toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit" }
      )}`;

      const endTime = `${endDate.getDate().toString().padStart(2, "0")}-${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${endDate.getFullYear()} ${endDate.toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit" }
      )}`;

      const auctioneerName = auction.auctionerId?.fullName || "Unknown";
      return {
        _id: auction._id,
        title: auction.title,
        // keep legacy field used by some clients
        auctioneer: auctioneerName,
        // normalized names (both spellings to be safe)
        auctionerName: auctioneerName,
        auctioneerName: auctioneerName,
        auctionerId: auction.auctionerId?._id || null,
        startTime,
        endTime,
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
    // populate auctioner name so clients can display it
    const ongoingDocs = await Auction.find({ status: "ongoing" }).populate("auctionerId", "accountType fullName organizationName contactPersonName email").lean();

    const ongoing = ongoingDocs.map(a => ({
      _id: a._id,
      title: a.title,
      startDateTime: a.startDateTime,
      endDateTime: a.endDateTime,
      basePrice: a.basePrice,
      auctioneer: a.auctionerId?.fullName || a.auctionerId?.organizationName || 'Unknown',
      auctionerName: a.auctionerId?.fullName || a.auctionerId?.organizationName || 'Unknown',
      auctioneerName: a.auctionerId?.fullName || a.auctionerId?.organizationName || 'Unknown',
      auctionerId: a.auctionerId?._id || null,
      status: a.status || 'ongoing',
    }));

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
      "accountType fullName organizationName contactPersonName email"
    );

    // Example winning bids array (randomized)
    const winningBids = ["₹180000", "₹200000", "₹220000", "₹250000", "₹300000"];

    // Format response
    const formatted = pastAuctions.map((auction, index) => {
      const name = auction.auctionerId?.name || 'Unknown';
      return {
        _id: auction._id,
        title: auction.title,
        auctioneer: name,
        auctionerName: name,
        auctioneerName: name,
        auctionerId: auction.auctionerId?._id || null,
        completionDate: auction.endDateTime.toISOString().split("T")[0],
        winningBid: winningBids[index % winningBids.length], // cycle through array
      };
    });

    res.json({ past: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuctionEndTime = async (req, res) => {
  try {
    const { auctionId } = req.body;

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("endDateTime");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      endDateTime: auction.endDateTime,
    });
  } catch (error) {
    console.error("Error fetching auction end time:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAuctionStartingBid = async (req, res) => {
  try {
    const { auctionId } = req.body;

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("basePrice");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      startingBid: auction.basePrice,
    });
  } catch (error) {
    console.error("Error fetching auction starting bid:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAuctionFile = async (req, res) => {
  try {
    const { auctionId } = req.params; // GET /auction-file/:auctionId

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("file");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      file: auction.file, // return the file path or URL
    });
  } catch (error) {
    console.error("Error fetching auction file:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isRegisteredForAuction = async (req, res) => {
  try {
    const { auctionId, userId } = req.body;

    if (!auctionId || !userId) {
      return res.status(400).json({ error: "auctionId and userId are required" });
    }

    // Check registration in AuctionRegistration collection
    const registration = await AuctionRegistration.findOne({
      auctionId,
      userId,
    }).lean();

    const isRegistered = !!registration;

    return res.status(200).json({ registered: isRegistered });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export const getOngoingAuctionsById = async (req, res) => {
  try {
    const { userId } = req.body; // Get userId from request body
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch auctions and populate auctioner name
    const auctions = await Auction.find({ status: "ongoing"}, "auctionerId title endDateTime")
      .populate("auctionerId", "accountType fullName organizationName contactPersonName email");

    // For each auction, check if user is registered
    const formattedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const registration = await AuctionRegistration.findOne({
          auctionId: auction._id,
          userId,
        });

        // derive a sensible display name from populated auctioner
        const populated = auction.auctionerId || {};
        const name = populated.fullName || populated.organizationName || populated.contactPersonName || populated.email || null;

        return {
          _id: auction._id,
          title: auction.title,
          endDateTime: auction.endDateTime,
          auctionerName: name,
          auctionerId: populated._id || null,
          isRegistered: !!registration, // true if registration exists, else false
        };
      })
    );

    res.status(200).json(formattedAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    // populate only existing fields on Auctioner (here: name)
    const auction = await Auction.findById(id)
      .select("-file") 
      .populate("auctionerId", "accountType fullName organizationName contactPersonName email")
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

// Get auctions by bidder id (auctions where the bidder has placed bids)
export const getAuctionsByBidderId = async (req, res) => {
  try {
    const { bidderId } = req.params;

    if (!bidderId) {
      return res.status(400).json({ message: 'bidderId is required' });
    }

    // Get distinct auction IDs where this user has placed bids
    const auctionIds = await Bid.find({ userId: bidderId }).distinct('auctionId');

    if (!auctionIds || auctionIds.length === 0) {
      return res.status(200).json({ auctions: [] });
    }

    // Fetch auctions and populate auctioner name, exclude file to keep response small
    let auctions = await Auction.find({ _id: { $in: auctionIds } })
      .select('-file')
      .populate('auctionerId', 'accountType fullName organizationName contactPersonName email')
      .lean();

    // Add image URL and include base64 image data directly in JSON
    auctions = auctions.map((a) => {
      const { file, ...rest } = a;
      return {
        ...rest,
        imageBase64: file || null,
        imageUrl: `${req.protocol}://${req.get('host')}/api/auctions/${a._id}/image`,
      };
    });

    return res.status(200).json({ auctions });
  } catch (error) {
    console.error('Error fetching auctions by bidderId:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get auctions by auctioner id (auctions created by a specific auctioneer)
export const getAuctionsByAuctionerId = async (req, res) => {
  try {
    const { auctionerId } = req.params;

    if (!auctionerId) {
      return res.status(400).json({ message: 'auctionerId is required' });
    }

    let auctions = await Auction.find({ auctionerId })
      .select('-file')
      .populate('auctionerId', 'accountType fullName organizationName contactPersonName email')
      .lean();

    auctions = auctions.map((a) => {
      const { file, ...rest } = a;
      return {
        ...rest,
        imageBase64: file || null,
        imageUrl: `${req.protocol}://${req.get('host')}/api/auctions/${a._id}/image`,
      };
    });

    return res.status(200).json({ auctions });
  } catch (error) {
    console.error('Error fetching auctions by auctionerId:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetDemo = async (req, res) => {
  try {
    const { userId, auctionId } = req.body;

    // 1. Clear all WinnerMail docs
    await WinnerMail.deleteMany({});

    // 2. If userId & auctionId provided → delete related bids
    if (userId && auctionId) {
      await Bid.deleteMany({ userId, auctionId });
    }

    return res.status(200).json({
      success: true,
      message: `WinnerMail cleared${
        userId && auctionId ? " and related bids deleted" : ""
      }.`,
    });
  } catch (error) {
    console.error("Error clearing WinnerMail:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}



