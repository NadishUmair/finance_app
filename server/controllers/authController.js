

const UserModel = require("../models/user");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.SignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    console.log(req.body);
    const emailExist = await UserModel.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }
     const hashPassword= await bcrypt.hash(password,10);

    const user = new UserModel({
      firstname,
      lastname,
      email,
      password:hashPassword
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    console.log("error",error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};



exports.Login = async(req,res)=>{
  try {
    console.log("hy")
       const {email,password}=req.body;
       console.log("body",req.body);
       const user= await UserModel.findOne({email:email});
       console.log("user",user);
       if(!user){
        return res.status(404).json({
          success:false,
          message:"email not exist"
        })
       }
      
       const matchPassword= await bcrypt.compare(password,user.password);
       console.log(matchPassword);
          if(!matchPassword){
        return res.status(404).json({
          success:false,
          message:"invalid password"
        })
       }
         const accessToken= jwt.sign(
          {id:user._id},
          process.env.JWTSECRET,
          {expiresIn: "7d"}
          
         )
       const { password: _, ...userWithoutPassword } = user.toObject();
         return res.status(200).json({
          success:false,
          data:userWithoutPassword,
          accessToken,
          message:"loged in successfully"
        })

  } catch (error) {
    console.log("error",error);
      return res.status(500).json({
          success:false,
          message:"internal server error"
        })
  }
}
