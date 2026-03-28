
const express=require("express");

const router= express.Router();

const {SignUp}= require("../controllers/authController");
const {Login}= require("../controllers/authController");

router.post('/user_signup',SignUp);

router.post('/user_login',Login);

module.exports=router;




