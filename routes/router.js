const express = require('express')
const route = express.Router();

const store = require('../MiddleWare/multer')

const auth = require("../auth/auth")

const { userValidation } = require('../validate/user/user_validate')

const { loginValidation } = require('../validate/user/user_validate')

const { productValidation } = require('../validate/user/user_validate')
route.use(express.urlencoded({extended:true}));

// import controller File
const controller = require('../Controller/controller')
route.get("/" , controller.homePage)
// get request for login and registration
route.get("/register", controller.registerForm)
  
route.get("/login", controller.loginForm)

// Login and Registration post Request
route.post("/login/dashboard",loginValidation, controller.login);

route.post("/register", store.single('profile'),userValidation, controller.register);

route.post("/register" ,)
route.get("/dashboard" , auth.valid, controller.dashboard)
// Ṣell product request
route.post("/sell", auth.valid, controller.sell);


route.post("/sell/product",auth.valid, controller.addProduct);

// Buy Product Request
route.get("/buy/:id",auth.valid, controller.buy);

// Show Order Histroy Request
route.post("/order",auth.valid, controller.order)

// Show Order Histroy Request
route.post("/history",auth.valid, controller.history)

// Edit product Request
route.get("/edit/:id",auth.valid, controller.edit);
route.post("/editProduct",auth.valid, controller.editProduct);

// Delete Product Request
route.get("/delete/:id",auth.valid, controller.delete);

// Adding cart Product Request
route.get("/cart/:id",auth.valid, controller.cart);

route.get("/my-cart-history" ,auth.valid, controller.myCartHistory)

// Adding cart Product Request
route.post("/my-cart",auth.valid, controller.myCart);

// Edit product Request
route.get("/cartEdit/:id",auth.valid, controller.cartEdit);
route.post("/cartEdit",auth.valid, controller.cartProduct);

// Delete Product Request
route.get("/cartDelete/:id",auth.valid, controller.cartDelete);


// Buying Product From Cart
route.get("/cartBuy/:id",auth.valid, controller.cartBuy);


// Buying Product From Cart
route.post("/place-order",auth.valid, controller.placeOrder);



// expotering module
module.exports = route;