
const express=require("express");

const router= express.Router();

const {SignUp,Login, forgetPassword, resetPassword, verifyOtp}= require("../controllers/authController");


router.post('/user-signup',SignUp);

router.post('/user-login',Login);

router.post('/forgot-password',forgetPassword);

router.post('/verify-otp',verifyOtp);

router.patch('/reset-password',resetPassword);

module.exports=router;




