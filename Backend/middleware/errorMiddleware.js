import multer from "multer";
const errorMiddleware = (err, req, res, next)=>{
    if(err instanceof multer.MulterError){
        if(err.code === "LIMIT_FILE_SIZE"){
            return res.status(400).json({
                success: false,
                message: "Image Size Should not exceed 5 MB."
            })
        }
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
    console.log(err);
    let statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message
    })
}

export default errorMiddleware;