const jwt = require("jsonwebtoken");
exports.protectedRoute = (req,res,next)=>{

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        console.log("Token from header:", token);
         console.log("Secret:", process.env.JWTSECRET);
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }
        const decoded= jwt.verify(token, process.env.JWTSECRET);
        console.log("Decoded token:", decoded);
        req.user=decoded;
        next();
    } catch (error) {
          console.log("JWT Error:", error.message); 
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
}