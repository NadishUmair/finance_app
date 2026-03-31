
exports.protectedRoute = (re,res)=>{

    try {
        const token= req.headers.authorizarion?.split("")[1];
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }
        const decoded= jwt.verify(token, process.env.JWTSECRET);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
}