import verifyToken from "../utils/verifyToken.js";

export const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({status: false, message: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    req.user = decoded;
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
    req.user = decoded;
    req.refreshToken = refreshToken;
    next();
    }
    catch(err){
        next(err);
    }
}