import AttendanceModel from "../models/attendance.js";
import OTPModel from "../models/otp.js";

const generateOTP=async(req,res)=>{
    try {
        const { otp,classId } = req.body; 
        if (!otp || !classId) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP is required" 
            });
          }
          await OTPModel.deleteMany({});
          const newOtp = await OTPModel.create({ otp,classId, otpExpiresAt: new Date(Date.now() + 20000) });
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
        const { otp,user ,classId} = req.body;
        if (!otp || !user || !classId) {
            return res.status(400).json({ 
              success: false, 
              message: 'All fields are required' 
            });
          }
        // console.log("Received OTP:", otp);
        // console.log("Received User:", user);
        const currentOtp = await OTPModel.findOne({classId});
        if (!currentOtp || new Date() > currentOtp.otpExpiresAt) {
            return res.status(400).json({ 
                success: false,
                 message: "Invalid OTP Please check your class" 
                });
          }
          
          if (currentOtp.classId !== classId) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP for this class" 
            });
        }
 
        //   console.log("Stored OTP:", currentOtp.otp);
        // console.log("OTP Expiration:", currentOtp.otpExpiresAt);

       if(currentOtp.otp === otp)  { 
          const attendance = await AttendanceModel.create({ user, status: "present",classId });
          res.status(201).json({
             message: "Attendance recorded",
             status: attendance.status
             });
            }
            else {
                
                return res.status(402).json({ 
                    success: false, 
                    message: "Incorrect OTP. Please try again." 
                });
            }


    } catch (error) {
        console.error(error);
         res.status(500).json({
             success: false, 
             message: "Internal server error" 
            });
    }
}

export {generateOTP,submitOTP}