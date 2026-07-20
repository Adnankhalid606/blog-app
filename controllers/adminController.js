export const getDashBoard = (req, res, next)=>{
    try{
        res.status(200).json({status: true, message: "Admin Dashboard"});
    }
    catch(err){
        next(err);
    }
}