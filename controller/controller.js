const user = require("../models/user");
const product = require("../models/product")
const order = require("../models/order");

const bcrypt = require('bcrypt')

let userId;

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
                res.render("home", {
                    productList: productList,
                    firstName: userInfo.firstName
                })

            } else {
                res.send("Username and Password Invalid !!!")
            }
        }

    } catch (error) {

        console.log(error)

    }
};

exports.loginForm = (req, res) => {
    res.render("login")
}
exports.registerForm = (req, res) => {
    res.render("register")
}

exports.register = async (req, res) => {
    try {

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        if (password === confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            password = await bcrypt.hash(password, salt);

            const userRegistration = new user({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                phoneNumber: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                password: password

            })

            const registred = await userRegistration.save();
            res.render("login")

        } else {
            res.send("Password are not matching")
        }

    } catch (error) {
        console.log(error)
    }
}

exports.sell = (req, res) => {
    res.render("sell")
}

exports.addProduct = async (req, res) => {
    try {

        const newProduct = new product({
            userId: userId,
            productName: req.body.productName,
            quantity: req.body.quantity,
            price: req.body.price,

        })

        const addingProduct = await newProduct.save();

        let userInfo = await user.findOne({
            _id: userId
        })

        let productList = await product.find({});

        res.render("home", {
            productList: productList,
            firstName: userInfo.firstName
        })


    } catch (error) {
        console.log(error)
    }
}

exports.buy = async (req, res) => {

    let productList = await product.find({});

    res.render("buy", {
        productList
    })

}
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
            console.log(availableQuantity);

            if (availableQuantity >= quantity) {

                let productId = productDetail._id;

                let totalPrice = quantity * (productDetail.price)

                const newOrder = new order({
                    userId: userId,
                    productId: productId,
                    productName: productName,
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

                res.render("myOrder", {
                    orderSummary,
                    userDetail

                })
            } else {

                res.send(`${quantity} is not available only left ${availableQuantity}`)
            }
        }

    } catch (error) {
        console.log(error)
    }
}