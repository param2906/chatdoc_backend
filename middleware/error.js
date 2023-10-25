const ErrorHandle = require("../utils/errorhandle")

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    if(err.name === 'CastError'){
        const message = `Resource is not found. InvalidId${err.path}`
        err = new(ErrorHandle(message,400))
    }
    if(err.code ===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new(ErrorHandle(message,400))
    }
    if(err.name === `JsonWebTokenError`){
        const message = `Json Web Token is invalid, Try again`
        err = new(ErrorHandle(message,400))
    }
    if(err.name === `JsonExpiredError`){
        const message = `Json Web Token is invalid, Try again`
        err = new(ErrorHandle(message,400))
    }

    res.status(err.statusCode).json({
        success:false,
        error:err.message,
    })
}