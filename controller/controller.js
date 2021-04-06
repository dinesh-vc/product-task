const user = require("../models/user");
const product = require("../models/product")
const order = require("../models/order");

// Import Bycrpt module for password hasing
const bcrypt = require('bcrypt')


let userId;


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
// regisration request
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
// Rendering Selling Form
exports.sell = (req, res) => {
    res.render("sell")
}
// Adding New Product
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

// Buying New Product
exports.buy = async (req, res) => {

    let productList = await product.find({});

    res.render("buy", {
        productList
    })

}
// Show Order History
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
exports.editProduct = async (req, res)=> {

    let productName = req.body.productName;

    let updateProduct = await product.updateOne({
        productName: productName
    }, {
        $set: {
            productName: productName,
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
        firstName: userInfo.firstName
    })
    
   
}
// Deletting Product
exports.delete=async(req,res)=>{
    let productId=req.params.id;
    let deleteProduct= await product.deleteOne({_id:productId});
    let productList = await product.find({});

    let userInfo = await user.findOne({
        _id: userId
    })

    res.render("home", {
        productList: productList,
        firstName: userInfo.firstName
    })
    
    
    }