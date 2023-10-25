const {SqlDatabase} = require("langchain/sql_db")
const { createSqlAgent, SqlToolkit } =  require("langchain/agents/toolkits/sql")
const { DataSource } = require ("typeorm")
const path = require('path')
const fs = require("fs")
const {OpenAI} = require("langchain/llms/openai")
require('dotenv').config();

exports.chatDatabase = async(req,res,next)=>{
    let input = req.body.prompt
    const type = req.body.type
    let filename
    let p
    if(type==="sqlite"){
        const file = req.files.file
        filename = file.name
        file.mv('../database' +filename)
    }
    else{
        const postgres = req.body.postgres
        p = JSON.parse(postgres)
    }
    let datasource
    if(type==="sqlite"){
        const paths = path.join(__dirname,'../database')
        const filepath = path.join(paths,"Chinook.db")
        
        datasource = new DataSource({
            type: type,
            database: filepath,
            // url :filepath,
        }
    )}
    
    else{
        datasource = new DataSource({
            type: type,
            host : p.host,
            port:  p.port,
            username: p.username,
            password: p.password,
            database:  p.databasename
        })
    }
    const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    });
    const model = new OpenAI({ temperature: 0.9,openAIApiKey:process.env.OPENAI_API_KEY});
    const toolkit = new SqlToolkit(db, model);
    
    const executor = createSqlAgent(model, toolkit);
    // console.log(executor)
    const input1 = `You should always run a SQL query to find out the answer. But do not show the select query. 
    Please always display the results in a tabular format. This is `
    input  = input +input1
    const result = await executor.call({input})
    console.log(result)
    res.status(201).json({
        success:true,
        result
    }) 
}