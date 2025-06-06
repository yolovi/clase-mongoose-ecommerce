const express = require("express")
const OrderController = require("../controllers/OrderController")
const { authentication, isAuthorOrder } = require("../middlewares/authentication")
const router = express.Router()

router.post("/", authentication, OrderController.create)
router.put("/id/:_id", authentication, isAuthorOrder, OrderController.update )

module.exports = router