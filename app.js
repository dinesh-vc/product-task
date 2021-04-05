const express = require('express');
const app = express();
const path = require('path');

const bcrypt = require('bcrypt')
const user = require("./models/user");
const product = require("./models/product")
const order = require("./models/order");


const ejs = require('ejs')

const port = process.env.PORT || 8084;
const host = process.env.HOST;

require('./database/connection')


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))


app.set("view engine", "ejs")
app.use('/' , require('./routes/router'))


app.listen(port, () => {
    console.log(`Server is running at port = ${port}`)
})