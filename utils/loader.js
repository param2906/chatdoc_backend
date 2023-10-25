const { PDFLoader } = require("langchain/document_loaders/fs/pdf")
const { TextLoader } = require("langchain/document_loaders/fs/text")
const { CSVLoader } = require("langchain/document_loaders/fs/csv")
const { JSONLoader } = require("langchain/document_loaders/fs/json")

exports.loaderFunction =async (ext,finalpath)=>{
    if(ext === '.txt'){
        const loader = new TextLoader(finalpath,{
        })
        return loader
    }
    else if(ext ==='.csv'){
        const loader = new CSVLoader(finalpath,{
        })
        return loader
    }
    else if(ext ==='.json'){
        const loader = new JSONLoader(finalpath,{
        })
        return loader
    }
    else if(ext ==='.pdf'){
        const loader = new PDFLoader(finalpath,{
        })
        return loader
    }
}