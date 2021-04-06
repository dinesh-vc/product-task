const express = require('express')
const route = express.Router();

const controller= require('../Controller/controller')

route.get("/register" , controller.registerForm )
route.get("/login" , controller.loginForm )
route.post("/login/dashboard" , controller.login);
route.post("/register" , controller.register);
route.post("/login/dashboard/sell" , controller.sell);
route.post("/login/dashboard/sell/product" , controller.addProduct);
route.post("/login/dashboard/buy" , controller.buy);
route.post("/login/dashboard/buy/my-order" , controller.order)

module.exports = route;
