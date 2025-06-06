const express = require("express")
const app = express()
const PORT = 8080
const { dbConnection } = require("./config/config")

dbConnection()

//MIDDLEWARE
app.use(express.json())

//RUTAS
app.use("/products", require("./routes/products"))
app.use("/users", require("./routes/users") )
app.use("/orders", require("./routes/orders"))

//SERVIDOR
app.listen(PORT, ()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
})

