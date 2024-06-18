const express = require("express")
const { createUser } = require("../controller/authController")
const router = express.Router()



router.post("/signin", createUser)

module.exports = router