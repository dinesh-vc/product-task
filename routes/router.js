const express = require('express')
const route = express.Router();

const controller= require('../Controller/controller')


route.get("/register", (req, res) => {
    res.render("register")
})

route.get("/login", (req, res) => {
    res.render("login")
})

route.post("/login" , controller.login);
route.post("/register" , controller.register);
route.post("/login/sell" , controller.sell);
route.post("/login/sell/product" , controller.addProduct);
route.post("/login/buy" , controller.buy);



module.exports = route;