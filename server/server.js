const gameplay = require("./src/gameplay.js")
const express = require('express')
const app = express()
const cors = require("cors");

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors("*"))

app.get("/test", (req, res) => {
    res.json({"users": ["userone","usertwo"]})
})

app.post("/buyDevCard", (req, res) => {
    gameplay.buyDevCard(req.body);
})

app.listen(5000, () => {console.log("Server Started")} )