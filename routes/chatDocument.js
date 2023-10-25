const express = require("express")
const router = express.Router()

const {uploadFiles,getVectorStore,chatDocument} = require("../controllers/chat")
const {chatDatabase} = require("../controllers/chatDatabase")
const {transcribeAudio} = require("../controllers/transcibeAudio")

router.route("/post").post(uploadFiles)

router.route("/getVectorStore").get(getVectorStore)

router.route("/chatpdf").post(chatDocument)

router.route("/chatDatabase").post(chatDatabase)

router.get("/translateAudio").get(transcribeAudio)

module.exports = router