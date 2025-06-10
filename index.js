const express = require("express")
const app = express()
require("dotenv").config()
// const PORT = 8080
const { dbConnection } = require("./config/config")
const { handleTypeError } = require("./middlewares/errors")

const PORT = process.env.PORT || 3000

dbConnection()

//MIDDLEWARE
app.use(express.json())

//RUTAS
app.use("/products", require("./routes/products"))
app.use("/users", require("./routes/users") )
app.use("/orders", require("./routes/orders"))

app.use(handleTypeError)

//SERVIDOR
app.listen(PORT, ()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
})

