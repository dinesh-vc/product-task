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

route.post("/user/sell" , controller.sell);

route.post("/user/sell/product" , controller.addProduct);


module.exports = route;