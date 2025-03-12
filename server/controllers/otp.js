import AttendanceModel from "../models/attendance.js";
import OTPModel from "../models/otp.js";

const generateOTP=async(req,res)=>{
    try {
        const { otp } = req.body; 
        if (!otp) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP is required" 
            });
          }
          await OTPModel.deleteMany({});
          const newOtp = await OTPModel.create({ otp, otpExpiresAt: new Date(Date.now() + 20000) });
            res.status(201).json({
                 message: "OTP generated successfully",
                  otp: newOtp 
                });

    } catch (error) {
        console.error(error);
         res.status(500).json({
             success: false, 
             message: "Internal server error" 
            });
    }
}
const submitOTP=async(req,res)=>{
    try {
        const { otp,user} = req.body;
        // console.log("Received OTP:", otp);
        // console.log("Received User:", user);
        const currentOtp = await OTPModel.findOne();
        if (!currentOtp || new Date() > currentOtp.otpExpiresAt) {
            return res.status(400).json({ 
                success: false,
                 message: "OTP has expired or not generated" 
                });
          }
        //   console.log("Stored OTP:", currentOtp.otp);
        // console.log("OTP Expiration:", currentOtp.otpExpiresAt);
          const status = currentOtp.otp === otp ? "present" : "absent";
          const attendance = await AttendanceModel.create({ user, status });
          res.status(201).json({
             message: "Attendance recorded",
             status: attendance.status
             });
    } catch (error) {
        console.error(error);
         res.status(500).json({
             success: false, 
             message: "Internal server error" 
            });
    }
}

export {generateOTP,submitOTP}