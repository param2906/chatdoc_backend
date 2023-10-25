const { OpenAIWhisperAudio } = require("langchain/document_loaders/fs/openai_whisper_audio");
const path = require('path')

exports.transcribeAudio = async(req,res,next)=>{
    const dirpath = path.join(__dirname,"../uploads");
    const filePath = path.join(dirpath,"new.mp3")
    let result
    try {
        const loader = new OpenAIWhisperAudio(filePath);
        result = await loader.load();
        console.log(result)
    } catch (error) {
        console.log(error)
    }
    res.status(201).json({
        success:true,
        result
    }) 
}