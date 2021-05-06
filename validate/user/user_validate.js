const { user } = require('./user.schema');
const { product } = require('./user.schema');
const { login } = require('./user.schema');

  const userValidation = async ( req , res , next) =>{
        const valid= await user.validate(req.body);
        if(valid.error){
            res.json({
                success : 0,
                message : valid.error.details[0].message
            })
        }else{
            next();
        }
    }
   
    const loginValidation = async ( req , res , next) =>{
        const valid= await login.validate(req.body);
        if(valid.error){
            res.json({
                success : 0,
                message : valid.error.details[0].message
            })
        }else{
            next();
        }
    }
    
  const productValidation = async ( req , res , next) =>{
    const valid= await product.validate(req.body);
    if(valid.error){
        res.json({
            success : 0,
            message : valid.error.details[0].message
        })
    }else{
        next();
    }
}

module.exports = { userValidation , productValidation , loginValidation}