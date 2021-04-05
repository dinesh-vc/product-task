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

        const userInfo = await user.findOne({
            email: email
        })

userId=userInfo._id;
        //  compare user passwor with stored hash password
        let comparedPassword = await bcrypt.compare(password, userInfo.password);

        // checking mail and password is correct or not

        if (email === userInfo.email && comparedPassword) {

            res.render("home", {
                firstName: userInfo.firstName
            })

        } else {
            res.send("Username and Password Invalid !!!")
        }

    } catch (error) {

        console.log(error)

    }
};

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
            res.send(` ${req.body.firstname}  Registred Succesfully !!!`);

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
            userId : userId,
            productName: req.body.productName,
            quantity: req.body.quantity,
            price: req.body.price,

        })

        const addingProduct = await newProduct.save();
        res.send(` ${req.body.productName}  Added Succesfully !!!`);

    } catch (error) {
        console.log(error)
    }
}