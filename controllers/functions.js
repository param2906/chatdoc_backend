const {loaderFunction} = require("../utils/loader")
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter")
const {OpenAIEmbeddings} = require("langchain/embeddings/openai")
const {FaissStore} = require("langchain/vectorstores/faiss")   
const {OpenAI} = require("langchain/llms/openai")
const { LLMChainExtractor } = require("langchain/retrievers/document_compressors/chain_extract");
const { ContextualCompressionRetriever } = require("langchain/retrievers/contextual_compression");
const { RetrievalQAChain } =require("langchain/chains");
const fs = require("fs")
const ErrorHandle = require("../utils/errorhandle")

exports.createFaisstore = async(ext,finalpath,directory)=>{
    const embeddings = new OpenAIEmbeddings()
    const loader = await loaderFunction(ext,finalpath)
    try {
        const docs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
        });
        
        const output = await splitter.splitDocuments(docs);
        
        const vectorStore = await FaissStore.fromDocuments(output,embeddings);
        
        fs.mkdirSync(directory);
        const save = await vectorStore.save(directory)
    } catch (error) {
        // return next(new ErrorHandle(error.message,400))
        console.log(error)
    }
    
    
}

exports.loadFaisstore = async(directory,query)=>{
    const embeddings = new OpenAIEmbeddings()
    const model = new OpenAI();
    const loadedVectorStore = await FaissStore.load(
        directory,
        embeddings
    );
    // With retriver
    const baseCompressor = LLMChainExtractor.fromLLM(model);
    const retriever = new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: loadedVectorStore.asRetriever(),
      });
    const chain = RetrievalQAChain.fromLLM(model, retriever)
    const message = await chain.call({
        query: query,
    });
    return message
}