const mongoose=require("mongoose");


const connectgDB= async()=>{
try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("databse connected successfully");
} catch (error) {
    console.log("error in databse connection",error);
}
}

module.exports=connectgDB;