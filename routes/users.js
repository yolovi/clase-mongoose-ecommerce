const express = require("express")
const UserController = require("../controllers/UserController")
const { authentication } = require("../middlewares/authentication")
const router = express.Router()

router.post("/", UserController.register)
router.post("/login", UserController.login)
router.get("/info", authentication, UserController.getInfo)
router.put("/likes/:_id", authentication, UserController.like)
router.delete('/logout',authentication, UserController.logout)


module.exports = router