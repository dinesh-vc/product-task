const express = require('express')
const route = express.Router();

// import controller File
const controller = require('../Controller/controller')

// get request for login and registration
route.get("/register", controller.registerForm)
route.get("/login", controller.loginForm)

// Login and Registration post Request
route.post("/login/dashboard", controller.login);
route.post("/register", controller.register);

route.get("/dashboard" , controller.dashboard)
// Ṣell product request
route.post("/sell", controller.sell);
route.post("/sell/product", controller.addProduct);

// Buy Product Request
route.get("/buy/:id", controller.buy);

// Show Order Histroy Request
route.post("/order", controller.order)

// Show Order Histroy Request
route.post("/history", controller.history)

// Edit product Request
route.get("/edit/:id", controller.edit);
route.post("/editProduct", controller.editProduct);

// Delete Product Request
route.get("/delete/:id", controller.delete);

// Adding cart Product Request
route.get("/cart/:id", controller.cart);

route.get("/my-cart-history" , controller.myCartHistory)

// Adding cart Product Request
route.post("/my-cart", controller.myCart);

// Edit product Request
route.get("/cartEdit/:id", controller.cartEdit);
route.post("/cartEdit", controller.cartProduct);

// Delete Product Request
route.get("/cartDelete/:id", controller.cartDelete);


// Buying Product From Cart
route.get("/cartBuy/:id", controller.cartBuy);


// Buying Product From Cart
route.post("/place-order", controller.placeOrder);



// expotering module
module.exports = route;