let jwt = require('jsonwebtoken');
const JWT_SECRET = "Hihowareyou"

const fetchUser = (req,res,next)=>{
    // Get the user from jwt token and add the id to req object
    const token = req.header('auth-Token');
    if(!token){
        res.status(401).send({error :"Please autheticate using a valid token"})
    }try{
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send({error :"Please autheticate using a valid token"})

    }
 
}

module.exports = fetchUser;