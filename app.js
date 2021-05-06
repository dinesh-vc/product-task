const express = require('express');
const app = express();
const path = require('path');
const multer =require ('multer')
require('dotenv').config();
// Importing Model from model folder
const user = require("./models/user");
const product = require("./models/product")
const order = require("./models/order");


app.use(express.urlencoded({extended:true}));


const ejs = require('ejs')

const port = process.env.PORT || 8084;
const host = process.env.HOST;

// importing Database connection
require('./database/connection')


app.use('/uploads',express.static(path.join(__dirname,'/uploads')));



app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

// Setting View Engine
app.set("view engine", "ejs")
// Route File path
app.use('/' , require('./routes/router'))

// Running Server on Port
app.listen(port, () => {
    console.log(`Server is running at port = ${port}`)
})