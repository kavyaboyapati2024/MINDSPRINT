import auctionReportModel from "../models/auctionReportModel.js";
import PDFDocument from "pdfkit";

// Get auction report by auctionId
export const getAuctionReport = async (req, res) => {
  try {
    const report = await auctionReportModel.findOne({ auctionId: req.params.auctionId });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//download auction report as PDF
export const downloadAuctionReport = async (req, res) => {
  try {
    const report = await auctionReportModel.findOne({ auctionId: req.params.auctionId });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=auction_report_${report.auctionId}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text("Auction Summary Report", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Auction ID: ${report.auctionId}`);
    doc.text(`Seller: ${report.seller.name} (${report.seller.email})`);

    if (report.winner) {
      doc.text(`Winner: ${report.winner.name} (${report.winner.email})`);
    } else {
      doc.text(`Winner: No Winner`);
    }

    doc.moveDown();
    doc.text(`Item: ${report.item.title}`);
    doc.text(`Base Price: ₹${report.item.basePrice}`);
    doc.text(`Description: ${report.item.description}`);
    doc.moveDown();
    doc.text(`Final Status: ${report.finalStatus}`);
    doc.text(`Final Price: ₹${report.finalPrice}`);

    doc.moveDown();
    doc.fontSize(16).text("Bid History:", { underline: true });

    report.biddingStats.bidHistory.forEach((bid) => {
      doc.fontSize(12).text(
        `Bidder: ${bid.bidderName} - ₹${bid.amount} at ${new Date(bid.time).toLocaleString()}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    return res.status(500).json({ error: err.message });
  }
};


