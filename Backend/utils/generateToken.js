import jwt from "jsonwebtoken";

const generateToken = (id, duration = process.env.JWT_EXPIRES_IN)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: duration})
}

export default generateToken;