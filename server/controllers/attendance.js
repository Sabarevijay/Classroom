import AttendanceModel from "../models/attendance.js";
import UserModel from "../models/user.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const getAttendance = async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    const attendance = await AttendanceModel.find({ classId });
    // if (!attendance) {
    //     return res.status(400).json({
    //         success:false,
    //         message:"No datas Found"

    //     })
    // }
    if (!attendance || attendance.length === 0) {
      return res.status(200).json({
        success: true,
        attendance: [],
        totalUsers: 0,
        presentCount: 0,
        absentCount: 0,
      });
    }
    // Get total number of users (assuming all users are potential attendees)
    const totalUsers = await UserModel.countDocuments({ role: "user" }); // Adjust this query based on your user model logic

    // Filter attendance for today
    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = attendance.filter((record) => {
      const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
      return recordDate === today;
    });

    // Calculate present count
    const uniquePresentUsers = new Set(
        todayAttendance
          .filter((record) => record.status === "present")
          .map((record) => record.user)
      );
      const presentCount = uniquePresentUsers.size;

    // Calculate absent count
    const absentCount = totalUsers - presentCount;
    res.status(200).json({
      success: true,
      attendance: todayAttendance, // Return only today's attendance
      totalUsers,
      presentCount,
      absentCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const downloadAttendanceReport = async (req, res) => {
    try {
      const { classId } = req.query;
      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
      }
  
      // Fetch attendance data for the current day
      const today = new Date().toISOString().split("T")[0];
      const attendance = await AttendanceModel.find({ classId });
      const todayAttendance = attendance.filter((record) => {
        const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
        return recordDate === today;
      });
  
      if (!todayAttendance || todayAttendance.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No attendance data found for today",
        });
      }
  
      // Create PDF
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `Attendance_Report_${today}.pdf`;
      const filePath = path.join(path.resolve(), "public", "reports", fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
  
      // Add title
      doc.fontSize(20).font("Helvetica-Bold").fillColor("#6b48ff").text(`Attendance Report - ${today}`, { align: "center" });
      doc.moveDown(1);
  
      // Add summary
      const totalUsers = await UserModel.countDocuments({ role: "user" });
      const uniquePresentUsers = new Set(
        todayAttendance
          .filter((record) => record.status === "present")
          .map((record) => record.user)
      );
      const presentCount = uniquePresentUsers.size;
      const absentCount = totalUsers - presentCount;
  
      doc.fontSize(12).font("Helvetica").fillColor("black");
      doc.text(`Total Students: ${totalUsers}`, { align: "left" });
      doc.text(`Present: ${presentCount}`, { align: "left" });
      doc.text(`Absent: ${absentCount}`, { align: "left" }); // Fixed typo
      doc.moveDown(2);
  
      // Table setup
      const tableTop = doc.y; // Start table at current y position
      const colWidths = [200, 100, 100]; // Widths for Email, Status, Hour
      const rowHeight = 30;
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      const startX = 50;
      let y = tableTop;
  
      // Draw table headers
      doc.fontSize(12).font("Helvetica-Bold").fillColor("white");
      doc.rect(startX, y, tableWidth, rowHeight).fill("#1a2526"); // Header background
      doc.fillColor("white");
      doc.text("Email", startX + 5, y + 8, { width: colWidths[0] - 10, align: "left" });
      doc.text("Status", startX + colWidths[0] + 5, y + 8, { width: colWidths[1] - 10, align: "left" });
      doc.text("Hour", startX + colWidths[0] + colWidths[1] + 5, y + 8, { width: colWidths[2] - 10, align: "left" });
      y += rowHeight;
  
      // Draw table rows
      doc.font("Helvetica").fillColor("black");
      todayAttendance.forEach((record, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.rect(startX, y, tableWidth, rowHeight).fill("#f1f7ff");
        } else {
          doc.rect(startX, y, tableWidth, rowHeight).fill("white");
        }
        doc.fillColor("black");
  
        // Draw row data
        doc.text(record.user, startX + 5, y + 8, { width: colWidths[0] - 10, align: "left", continued: false });
        doc.text(record.status, startX + colWidths[0] + 5, y + 8, { width: colWidths[1] - 10, align: "left", continued: false });
        doc.text(record.hour || "N/A", startX + colWidths[0] + colWidths[1] + 5, y + 8, { width: colWidths[2] - 10, align: "left", continued: false });
  
        // Draw row separator
        doc.moveTo(startX, y + rowHeight).lineTo(startX + tableWidth, y + rowHeight).stroke();
        y += rowHeight;
      });
  
      // Draw table borders
      doc.strokeColor("#d1d5db");
      doc.moveTo(startX, tableTop).lineTo(startX, y).stroke(); // Left border
      doc.moveTo(startX + colWidths[0], tableTop).lineTo(startX + colWidths[0], y).stroke(); // Middle border 1
      doc.moveTo(startX + colWidths[0] + colWidths[1], tableTop).lineTo(startX + colWidths[0] + colWidths[1], y).stroke(); // Middle border 2
      doc.moveTo(startX + tableWidth, tableTop).lineTo(startX + tableWidth, y).stroke(); // Right border
      doc.moveTo(startX, tableTop).lineTo(startX + tableWidth, tableTop).stroke(); // Top border
      doc.moveTo(startX, y).lineTo(startX + tableWidth, y).stroke(); // Bottom border
  
      doc.end();
  
      stream.on("finish", () => {
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error("Download error:", err);
            res.status(500).json({ success: false, message: "Error downloading file" });
          }
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
          });
        });
      });
    } catch (error) {
      console.error("Error generating attendance report:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  


export { getAttendance,downloadAttendanceReport };
