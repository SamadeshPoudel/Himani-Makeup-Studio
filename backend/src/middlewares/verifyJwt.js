import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyJwt (req, res, next){
    const authHeader = req.headers.authorization;
    //check if the token exists and is in Bearer format
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({msg:"Access denied. No token provided"})
    }
    try {
        //verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach userinfo to request
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(403).json({msg:"Invalid or expired token"});
    }
}