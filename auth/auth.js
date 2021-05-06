require('dotenv').config();
const jwt = require("jsonwebtoken")
let SecretKey=process.env.SecretKey;

let valid=(req,res,next )=>{
    try {
        const token = req.headers['name'];
  
        const verified = jwt.verify(token, SecretKey);
        if(verified){
            res.send("Token Successfully Verified");
            next();
        }else{
            // Access Denied
           res.status(401).send("Token Invalid or Expire");
           
        }
    } catch (error) {
        // Access Denied
       res.status(401).send("Token Invalid or Expire");
        
    }

   
}

module.exports={valid};