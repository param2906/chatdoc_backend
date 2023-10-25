const path = require('path')
const fs = require("fs")
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandle = require("../utils/errorhandle")
const {moveFile} = require("../utils/moveFile")
require('dotenv').config();
const { createFaisstore,loadFaisstore } = require("./functions")
exports.uploadFiles = catchAsyncError(async (req,res,next)=>{
    const file = req.files.file
    if(!file){
        return next(new ErrorHandle("File in not Uploaded",400) )
    }
    const uploadpath = path.join(__dirname,`../uploads/`)
    // file.mv(uploadpath +file.name)
    await moveFile(file,uploadpath)
    const finalpath = path.join(uploadpath,file.name); 
    const filename = file.name
    // const ext = filename.split('.').slice(1).join('.')

    // const name = filename.split('.').slice(0,1).join('.')   

    const ext = path.extname(finalpath)
    const name = path.parse(finalpath).name 
 
    const directory =path.join(__dirname,`../vectorestore/${name}`)
  
    if (!fs.existsSync(directory)) {
        await createFaisstore(ext,finalpath,directory)
    }
    
    res.status(201).json({
        success:true,
        filename
    })
    
})

exports.getVectorStore =catchAsyncError(async(req,res,next)=>{
    const vectorestore= path.join(__dirname,'../uploads')
    
    let store = []
    fs.readdirSync(vectorestore).map((item) => {
       
        store.push(item)
    });
   
    res.status(201).json({
        success:true,
        store 
    })
})

exports.chatDocument =catchAsyncError(async(req,res,next)=>{
    const prompt = req.body.prompt
    const filename = req.body.filename
    if(!prompt || !filename){
        return next(new ErrorHandle("Please enter prompt",400))
    }
    const name = filename.split('.').slice(0,1).join('.')
    const directory =path.join(__dirname,`../vectorestore/${name}`)
    const query = prompt
    const messages = await loadFaisstore(directory,query)
    res.status(201).json({
        success:true,
        messages:messages.text
    }) 
})