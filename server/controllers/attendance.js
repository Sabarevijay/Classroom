import AttendanceModel from "../models/attendance.js";
import UserModel from "../models/user.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const getAttendance = async (req, res) => {
    try {
      const { classId, fromDate, toDate } = req.query;
      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
      }
  
      console.log("Fetching attendance for classId:", classId, "fromDate:", fromDate, "toDate:", toDate);
  
      const attendance = await AttendanceModel.find({ classId });
      console.log("Total attendance records found:", attendance.length);
  
      if (!attendance || attendance.length === 0) {
        console.log("No attendance records found for classId:", classId);
        return res.status(200).json({
          success: true,
          attendance: [],
          totalUsers: 0,
          presentCount: 0,
          absentCount: 0,
        });
      }
  
      const totalUsers = await UserModel.countDocuments({ role: "user" });
      console.log("Total users:", totalUsers);
  
      // Filter attendance based on the provided date range or default to today
      let filteredAttendance = attendance;
      if (fromDate && toDate) {
        const startOfRange = new Date(fromDate);
        startOfRange.setHours(0, 0, 0, 0);
        const endOfRange = new Date(toDate);
        endOfRange.setHours(23, 59, 59, 999);
  
        filteredAttendance = attendance.filter((record) => {
          const recordDate = new Date(record.createdAt);
          const isWithinRange = recordDate >= startOfRange && recordDate <= endOfRange;
          console.log("Record:", record, "Record date:", recordDate, "Is within range:", isWithinRange);
          return isWithinRange;
        });
      } else {
        // Default to today if no date range is provided
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        filteredAttendance = attendance.filter((record) => {
          const recordDate = new Date(record.createdAt);
          return recordDate >= startOfDay && recordDate <= endOfDay;
        });
      }
  
      console.log("Filtered attendance records:", filteredAttendance.length);
  
      const uniquePresentUsers = new Set(
        filteredAttendance
          .filter((record) => record.status === "present")
          .map((record) => record.user)
      );
      const presentCount = uniquePresentUsers.size;
      const absentCount = totalUsers - presentCount;
  
      res.status(200).json({
        success: true,
        attendance: filteredAttendance,
        totalUsers,
        presentCount,
        absentCount,
      });
    } catch (error) {
      console.error("Error in getAttendance:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  const downloadAttendanceReport = async (req, res) => {
    try {
      const { classId, fromDate, toDate } = req.query;
      if (!classId || !fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message: "Class ID, From Date, and To Date are required",
        });
      }
  
      // Validate date range
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        return res.status(400).json({
          success: false,
          message: "From Date cannot be later than To Date",
        });
      }
  
      // Fetch attendance data for the date range
      const attendance = await AttendanceModel.find({
        classId,
        createdAt: {
          $gte: from,
          $lte: new Date(to.setHours(23, 59, 59, 999)),
        },
      });
  
      if (!attendance || attendance.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No attendance data found for the selected date range",
        });
      }
  
      // Group attendance by date and user
      const groupedByDate = {};
      attendance.forEach((record) => {
        const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
        if (!groupedByDate[recordDate]) {
          groupedByDate[recordDate] = {};
        }
        if (!groupedByDate[recordDate][record.user]) {
          groupedByDate[recordDate][record.user] = [];
        }
        groupedByDate[recordDate][record.user].push(record);
      });
  
      // Sort dates in descending order
      const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));
  
      // Create PDF
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `Attendance_Report_${fromDate}_to_${toDate}.pdf`;
      const filePath = path.join(path.resolve(), "public", "reports", fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
  
      // Add title with date range
      doc.fontSize(20).font("Helvetica-Bold").fillColor("#6b48ff").text(`Attendance Report (${fromDate} to ${toDate})`, { align: "center" });
      doc.moveDown(1);
  
      // Add summary
      const totalUsers = await UserModel.countDocuments({ role: "user" });
      const uniquePresentUsers = new Set(
        attendance
          .filter((record) => record.status === "present")
          .map((record) => record.user)
      );
      const presentCount = uniquePresentUsers.size;
      const absentCount = totalUsers - presentCount;
  
      doc.fontSize(12).font("Helvetica").fillColor("black");
      doc.text(`Total Students: ${totalUsers}`, { align: "left" });
      doc.text(`Present: ${presentCount}`, { align: "left" });
      doc.text(`Absent: ${absentCount}`, { align: "left" });
      doc.moveDown(2);
  
      // Table setup for each date
      const colWidths = [180, 80, 80, 80]; // Adjusted widths for Email, Status, Hour, Percentage
      const rowHeight = 30;
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      const startX = 50;
      const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
      const beigeColor = "#f5f5dc"; // Beige color
  
      // Function to draw table headers
      const drawTableHeaders = (y) => {
        doc.fontSize(12).font("Helvetica-Bold").fillColor("white");
        doc.rect(startX, y, tableWidth, rowHeight).fill("#1a2526");
        doc.fillColor("white");
        doc.text("Email", startX + 5, y + 8, { width: colWidths[0] - 10, align: "left" });
        doc.text("Status", startX + colWidths[0] + 5, y + 8, { width: colWidths[1] - 10, align: "left" });
        doc.text("Hour", startX + colWidths[0] + colWidths[1] + 5, y + 8, { width: colWidths[2] - 10, align: "left" });
        doc.text("Percentage", startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, y + 8, { width: colWidths[3] - 10, align: "left" });
        return y + rowHeight;
      };
  
      sortedDates.forEach((date, dateIndex) => {
        const users = groupedByDate[date];
  
        // Check if there's enough space for the subheading, table headers, and at least one row
        const subheadingHeight = 40;
        const minTableHeight = rowHeight * 2; // Table headers + at least one row
        if (doc.y + subheadingHeight + minTableHeight > pageHeight) {
          doc.addPage();
        }
  
        // Add date subheading (aligned to the left)
        doc.fontSize(16).font("Helvetica-Bold").fillColor("black").text(`Date: ${date}`, { align: "left" });
        doc.moveDown(0.5);
  
        // Table setup
        let tableTop = doc.y;
        let y = drawTableHeaders(tableTop);
  
        // Draw table rows for each user
        doc.font("Helvetica").fillColor("black");
        Object.keys(users).forEach((user, userIndex) => {
          const userRecords = users[user];
          const hoursPresent = userRecords.filter(record => record.status === "present").length;
          const totalHours = 7; // Assuming 7 hours per day
          const percentage = ((hoursPresent / totalHours) * 100).toFixed(2); // Calculate percentage
  
          // Calculate the total height for this user's rows
          const userRowCount = userRecords.length;
          const userTableHeight = userRowCount * rowHeight;
  
          // Check if there's enough space for the user's entire section
          if (y + userTableHeight > pageHeight) {
            // Draw table borders for the current page
            doc.strokeColor("#d1d5db");
            doc.moveTo(startX, tableTop).lineTo(startX, y).stroke();
            doc.moveTo(startX + colWidths[0], tableTop).lineTo(startX + colWidths[0], y).stroke();
            doc.moveTo(startX + colWidths[0] + colWidths[1], tableTop).lineTo(startX + colWidths[0] + colWidths[1], y).stroke();
            doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2], y).stroke();
            doc.moveTo(startX + tableWidth, tableTop).lineTo(startX + tableWidth, y).stroke();
            doc.moveTo(startX, tableTop).lineTo(startX + tableWidth, tableTop).stroke();
            doc.moveTo(startX, y).lineTo(startX + tableWidth, y).stroke();
  
            doc.addPage();
            tableTop = doc.y;
            y = drawTableHeaders(tableTop);
          }
  
          // Draw the entire table section with beige background
          doc.rect(startX, y, tableWidth, userTableHeight).fill(beigeColor);
          doc.fillColor("black");
  
          // Draw the merged percentage cell for this user
          const percentageCellX = startX + colWidths[0] + colWidths[1] + colWidths[2];
          const percentageCellHeight = userRowCount * rowHeight;
          doc.rect(percentageCellX, y, colWidths[3], percentageCellHeight).fill(beigeColor);
          doc.fillColor("black");
          // Center the percentage text vertically and horizontally
          const percentageTextY = y + (percentageCellHeight - 12) / 2; // 12 is approximate font height
          doc.text(`${percentage}%`, percentageCellX + 5, percentageTextY, { width: colWidths[3] - 10, align: "center" });
  
          // Draw the other cells (Email, Status, Hour) for each record
          userRecords.forEach((record, index) => {
            const rowY = y + index * rowHeight;
  
            // Draw the cells for Email, Status, and Hour
            doc.fillColor("black");
            doc.text(record.user, startX + 5, rowY + 8, { width: colWidths[0] - 10, align: "left", continued: false });
            doc.text(record.status, startX + colWidths[0] + 5, rowY + 8, { width: colWidths[1] - 10, align: "left", continued: false });
            doc.text(record.hour || "N/A", startX + colWidths[0] + colWidths[1] + 5, rowY + 8, { width: colWidths[2] - 10, align: "left", continued: false });
  
            // Draw horizontal line for each row, but skip the percentage column
            doc.strokeColor("#d1d5db");
            doc.moveTo(startX, rowY + rowHeight).lineTo(startX + tableWidth - colWidths[3], rowY + rowHeight).stroke();
          });
  
          y += userTableHeight;
        });
  
        // Draw table borders
        doc.strokeColor("#d1d5db");
        doc.moveTo(startX, tableTop).lineTo(startX, y).stroke();
        doc.moveTo(startX + colWidths[0], tableTop).lineTo(startX + colWidths[0], y).stroke();
        doc.moveTo(startX + colWidths[0] + colWidths[1], tableTop).lineTo(startX + colWidths[0] + colWidths[1], y).stroke();
        doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2], y).stroke();
        doc.moveTo(startX + tableWidth, tableTop).lineTo(startX + tableWidth, y).stroke();
        doc.moveTo(startX, tableTop).lineTo(startX + tableWidth, tableTop).stroke();
        doc.moveTo(startX, y).lineTo(startX + tableWidth, y).stroke();
  
        // Add consistent space after each date section
        doc.moveDown(2);
      });
  
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
  
export { getAttendance, downloadAttendanceReport };