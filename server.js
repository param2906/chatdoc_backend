const express = require("express")
const bodyparse = require("body-parser")
const chatDocument = require("./routes/chatDocument")
const errorMiddleware = require("./middleware/error")
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config();
const app = express()
app.use(cors({
    origin: "http://localhost:5174"
}))
app.use(bodyparse.urlencoded({extended:true}))
app.use(fileUpload());
// app.use(bodyparse.urlencoded({ extended: true }))
app.use(express.json())

app.use("",chatDocument)
app.use(errorMiddleware)

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})
