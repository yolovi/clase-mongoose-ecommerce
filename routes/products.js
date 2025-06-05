const express = require("express")
const ProductController = require("../controllers/ProductController")
const Product = require("../models/Product")
const router = express.Router()

router.post("/", ProductController.create)
router.get("/", ProductController.getAll)
router.get("/id/:_id", ProductController.getById)
router.get("/name/:name", ProductController.getProductsByName)
router.delete("/id/:_id", ProductController.delete)
router.put("/id/:_id", ProductController.update)


module.exports = router