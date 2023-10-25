const fs = require("fs")

exports.moveFile = async(file,uploadpath)=>{
    await file.mv(uploadpath +file.name)
}