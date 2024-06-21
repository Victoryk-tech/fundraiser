const express = require("express")
const { createUser, loginUser } = require("../controller/authController")
const router = express.Router()



router.post("/signin", createUser)
router.post("/signup", loginUser)

module.exports = router