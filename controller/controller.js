const user = require("../models/user");
const product = require("../models/product")
const order = require("../models/order");
const cart = require("../models/cart")

require('dotenv').config();
const jwt =require("jsonwebtoken")
const fs = require('fs')

let secretKey=process.env.SecretKey
// Import Bycrpt module for password hasing
const bcrypt = require('bcrypt')
let userId;
let img;

exports.homePage = (req, res) => {
    res.render("homePage")
}

// Rendering LoginForm
exports.loginForm = (req, res) => {
    res.render("login")
}

// rendring Registration Form
exports.registerForm = (req, res) => {
    res.render("register")
}
// login request
exports.login = async (req, res) => {

    try {
        let email = req.body.email;
        let password = req.body.password;
      

        // checking user data in database

        let userInfo = await user.findOne({
            email: email
        })

       

        if (!userInfo) {
            res.send("Please Register First !!")
        } else {
            userId = userInfo._id;
            //  compare user passwor with stored hash password
            let comparedPassword = await bcrypt.compare(password, userInfo.password);

            // checking mail and password is correct or not

            if (email === userInfo.email && comparedPassword) {


                let productList = await product.find({});

                var token = jwt.sign( {email :userInfo.email } , secretKey , {expiresIn: '2000s'});

                res.status(200).send({ auth: true, token: token });

                res.render("home", {
                    productList: productList,
                    userDetail: userInfo
                })

            } else {
                res.send("Username and Password Invalid !!!")
            }
        }

    } catch (error) {

        console.log(error)

    }
};
// regisration request
exports.register = async (req, res) => {
    try {
        let email = req.body.email;
        let userInfo = await user.findOne({
            email: email
        })
        if (userInfo) {
            res.send(`Someone is already registed with ${email} !! Please Register With Another Mail Id !!!!`)
        } else {
            let password = req.body.password;
            let confirmPassword = req.body.confirmPassword;

            if (password === confirmPassword) {

                const salt = await bcrypt.genSalt(10);
                // now we set user password to hashed password
                password = await bcrypt.hash(password, salt);

                let profileImg = req.body.userImg;
                
                const userRegistration = new user({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    address: req.body.address,
                    userImg: profileImg,
                    password: password
                })

                const registred = userRegistration.save();
                res.render("login")

            } else {
                res.send("Password are not matching")
            }
        }
    } catch (error) {
        console.log(error)
    }
}

exports.dashboard = async (req, res) => {

    let productList = await product.find({});
    let userInfo = await user.findOne({
        _id: userId
    })
    res.render("home", {
        productList: productList,
        userDetail: userInfo
    })


}
// Rendering Selling Form
exports.sell = (req, res) => {
    res.render("sell")
}
// Adding New Product
exports.addProduct = async (req, res) => {
    try {
        
        
        // Create a base64 string from an image => ztso+Mfuej2mPmLQxgD ...
       
        const base64 = fs.readFileSync(req.body.productImg, "base64");

        // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
        const buffer = Buffer.from(base64, "base64");

        let imgPath = `./uploads/product/${req.body.productImg}`;

        fs.writeFileSync(imgPath, buffer);

        const newProduct = new product({
            userId: userId,
            productImg: req.body.productImg,
            productName: req.body.productName,
            quantity: req.body.quantity,
            price: req.body.price,

        })
        const addingProduct = await newProduct.save();

        

        let userInfo = await user.findOne({
            _id : userId
        })

        let productList = await product.find({
            userId: userId
        });

        



    } catch (error) {
        console.log(error)
    }
}

// Buying New Product
exports.buy = async (req, res) => {
    let productId = req.params.id;

    let productList = await product.find({
        _id: productId
    });
    console.log(productList)

    res.render("buy", {
        productName: productList[0].productName
    })

}
// Placeing Order
exports.order = async (req, res) => {
    try {
        let userDetail = await user.findOne({
            _id: userId
        });

        let productName = req.body.productName;
        let quantity = req.body.quantity;

        let productDetail = await product.findOne({
            productName
        });

        if (!productDetail) {
            res.send("Product is not avaible");
        } else {

            availableQuantity = productDetail.quantity;

            if (availableQuantity >= quantity) {

                let productId = productDetail._id;

                let totalPrice = quantity * (productDetail.price)

                const newOrder = new order({
                    userId: userId,
                    productId: productId,
                    productName: productName,
                    productImg: productDetail.productImg,
                    quantity: quantity,
                    totalPrice: totalPrice

                })

                const orderDetail = await newOrder.save();

                let orderSummary = await order.find({
                    userId
                });

                remainQuantity = (availableQuantity - quantity);

                const updateQuantity = product.findOneAndUpdate({
                    productName: productName
                }, {
                    $set: {
                        quantity: remainQuantity
                    }
                }, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Quantity updated Succesfuly")
                    }
                });

                let total = 0;

                for (let order of orderSummary) {
                    total = total + order.totalPrice;
                }

                res.render("myOrder", {
                    orderSummary,
                    userDetail,
                    total,

                })
            } else {

                res.send(`  ${quantity} ${productName}is out of stock only left ${availableQuantity}`)
            }
        }

    } catch (error) {
        console.log(error)
    }
}
// Showing Order History
exports.history = async (req, res) => {
    try {
        let userDetail = await user.findOne({
            _id: userId
        });

        let orderSummary = await order.find({
            userId: userId
        });

        let total = 0;

        for (let order of orderSummary) {
            total = total + order.totalPrice;
        }

        res.render("myOrder", {
            orderSummary,
            userDetail,
            total

        })


    } catch (error) {
        console.log(error)
    }
}
// Edit Product Detail Request
exports.edit = async (req, res) => {

    let productId = req.params.id;

    let editProduct = await product.findOne({
        _id: productId
    });

    res.render("editProduct", {
        editProduct
    })


}
// Storing Product updated Detail
exports.editProduct = async (req, res) => {

    let productId = req.body.productId;

    let updateProduct = await product.updateOne({
        _id: productId
    }, {
        $set: {
            productName: req.body.productName,
            quantity: req.body.quantity,
            price: req.body.price
        }
    })

    let productList = await product.find({});

    let userInfo = await user.findOne({
        _id: userId
    })

    res.render("home", {
        productList: productList,
        userDetail: userInfo
    })


}
// Deletting Product
exports.delete = async (req, res) => {
    let productId = req.params.id;
    let deleteProduct = await product.deleteOne({
        _id: productId
    });
    let productList = await product.find({});

    let userInfo = await user.findOne({
        _id: userId
    })

    res.render("home", {
        productList: productList,
        userDetail: userInfo
    })


}


// Adding New Product in Cart
exports.cart = async (req, res) => {
    let productId = req.params.id;

    let productList = await product.findOne({
        _id: productId
    });
    let userDetail = await user.findOne({
        _id: userId
    });

    res.render("cart", {
        productName: productList.productName,
        userDetail
    })

}

exports.myCartHistory = async (req, res) => {

    let userDetail = await user.findOne({
        _id: userId
    });

    let cartSummary = await cart.find({
        userId: userId
    });
    res.render("mycart", {
        cartSummary,
        userDetail
    })
}

exports.myCart = async (req, res) => {
    try {
        let userDetail = await user.findOne({
            _id: userId
        });

        let productDetail = await product.findOne({
            productName: req.body.productName
        })

        let quantity = req.body.quantity;
        let productName = req.body.productName;
        let availableQuantity = productDetail.quantity;

        if (availableQuantity >= quantity) {
            if (!productDetail) {
                res.send("Cart is Empty !!!")
            } else {

                const newCart = new cart({
                    userId: userId,
                    productId: productDetail.productId,
                    productName: productDetail.productName,
                    productImg: productDetail.productImg,
                    quantity: req.body.quantity,
                    price: productDetail.price

                })

                const cartDetail = await newCart.save();
                let cartSummary = await cart.find({
                    userId: userId
                });
                res.render("mycart", {
                    cartSummary,
                    userDetail
                })
            }


        } else {
            res.send(`${quantity} ${productName} out of Stock Left only ${availableQuantity} `)
        }






    } catch (error) {
        console.log(error)
    }
}
// Edit Product Detail Request
exports.cartEdit = async (req, res) => {

    let cartId = req.params.id;

    let editCart = await cart.findOne({
        _id: cartId
    });

    res.render("editCart", {
        editCart
    })


}
// Storing Product updated Detail
exports.cartProduct = async (req, res) => {

    let cartId = req.body.cartId;

    let productDetail = await product.findOne({
        productName: req.body.productName
    })
    let quantity = req.body.quantity;
    let productName = req.body.productName;
    let availableQuantity = productDetail.quantity;

    if (availableQuantity >= quantity) {
        let updatecart = await cart.updateOne({
            _id: cartId
        }, {
            $set: {
                quantity: req.body.quantity,

            }
        })

        let cartSummary = await cart.find({});

        let userDetail = await user.findOne({
            _id: userId
        })

        res.render("mycart", {
            cartSummary,
            userDetail
        })



    } else {

        res.send(`${quantity} ${productName} is out of Stock Only left ${availableQuantity}`)

    }


}

// Deletting Product
exports.cartDelete = async (req, res) => {
    let cartId = req.params.id;
    let deleteCart = await cart.deleteOne({
        _id: cartId
    });
    let cartSummary = await cart.find({});

    let userDetail = await user.findOne({
        _id: userId
    })


    res.render("mycart", {
        cartSummary,
        userDetail
    })


}


// Buying New Product From Cart
exports.cartBuy = async (req, res) => {


    try {
        let userDetail = await user.findOne({
            _id: userId
        });

        let cartId = req.params.id;

        let cartProduct = await cart.findOne({
            _id: cartId
        });

        let productName = cartProduct.productName;
        let quantity = cartProduct.quantity;

        let productDetail = await product.findOne({
            productName
        });

        if (!productDetail) {
            res.send("Product is not avaible");
        } else {

            availableQuantity = productDetail.quantity;

            if (availableQuantity >= quantity) {

                let productId = productDetail._id;

                let totalPrice = quantity * (productDetail.price)

                const newOrder = new order({
                    userId: userId,
                    productId: productId,
                    productName: productName,
                    productImg: productDetail.productImg,
                    quantity: quantity,
                    totalPrice: totalPrice

                })

                const orderDetail = await newOrder.save();

                let orderSummary = await order.find({
                    userId
                });

                remainQuantity = (availableQuantity - quantity);

                const updateQuantity = product.findOneAndUpdate({
                    productName: productName
                }, {
                    $set: {
                        quantity: remainQuantity
                    }
                }, (err) => {
                    if (err) {
                        console.log(err)
                    } else {

                        console.log("Quantity updated Succesfuly")

                    }
                });

                let deleteCart = await cart.deleteOne({
                    _id: cartId
                });
                console.log(deleteCart)

                res.render("myOrder", {
                    orderSummary,
                    userDetail,
                    total: totalPrice

                })
            } else {

                res.send(`${quantity} is not available only left ${availableQuantity}`)
            }
        }

    } catch (error) {
        console.log(error)
    }

}

// Placeing Order
exports.placeOrder = async (req, res) => {
    try {

        let cartProduct = await cart.find({
            userId: userId
        });


        let userDetail = await user.findOne({
            _id: userId
        });


        for (let cart of cartProduct) {

            let productName = cart.productName;
            let quantity = cart.quantity;

            let productDetail = await product.findOne({
                productName: productName
            });


            if (!productDetail) {
                res.send(`${productDetail.productName} Product is Not Availble `);
            } else {

                availableQuantity = productDetail.quantity;

                if (availableQuantity >= quantity) {

                    let productId = productDetail._id;

                    let totalPrice = quantity * (productDetail.price)

                    const newOrder = new order({
                        userId: userId,
                        productId: productId,
                        productName: productName,
                        productImg: productDetail.productImg,
                        quantity: quantity,
                        totalPrice: totalPrice

                    })

                    const orderDetail = await newOrder.save();

                    let orderSummary = await order.find({
                        userId
                    });

                    remainQuantity = (availableQuantity - quantity);

                    const updateQuantity = product.findOneAndUpdate({
                        productName: productName
                    }, {
                        $set: {
                            quantity: remainQuantity
                        }
                    }, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Quantity updated Succesfuly")
                        }
                    });


                    let deleteCart = await cart.deleteOne({
                        _id: cart._id
                    });

                    let total = 0;

                    for (let order of orderSummary) {
                        total = total + order.totalPrice;
                    }

                    res.render("cartOrder", {
                        orderSummary,
                        userDetail,
                        total

                    })
                } else {

                    aler(`${productName} Quantity ${quantity} is not available only left ${availableQuantity}`)
                }
            }
        }


    } catch (error) {
        res.send(error)
    }
}