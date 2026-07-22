import { findUserById } from "../services/userServices.js";
import verifyToken from "../utils/verifyToken.js";

export const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({status: false, message: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const user = await findUserById(decoded.id);
    req.user = user;
    next();
    }
    catch(err){
        next(err);
    }
};

export const protectRefresh = async (req, res, next)=>{
    try{
        const refreshToken = req.cookies.refreshtoken;
    if(!refreshToken){
        return res.status(401).json({status: false, message: "Unauthorized"});
    }
    const decoded = await verifyToken(refreshToken);
    const user = await findUserById(decoded.id);
    req.user = user;
    req.refreshToken = refreshToken;
    next();
    }
    catch(err){
        next(err);
    }
}

export const allowRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({status: false, message: "Forbidden"});
        }
        next();
    }
};