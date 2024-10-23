const express = require('express');
const User = require('../models/User');
// Express validator is a package for easy validation
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "Hihowareyou"



//  ROUTE 1 :Create a user POST 'api/auth/createUser'. No login required
// Array used here for validation
router.post('/createUser', [

    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return bad request
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    // Check wether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry user with this email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        // Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            user:{
                id:user.id
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET)
        success = true
        res.json({success,authToken})
    }

    // Checking if there is any error
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    
  })


//   ROUTE 2
//   Authenticate a user: POST "/api/auth/login"
router.post('/login', [
    body('email').isEmail(),
    body('password',"Password can't be blank").exists()
], async (req, res)=>{
    let success = false
    // Checking for the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;

    try{
        let user = await User.findOne({email});
        if(!user){
            success = flase
            return res.status(400).json({success, error:"Please try to login with correct credentials"})
        }

        const passCompare =await  bcrypt.compare(password,user.password);
        if(!passCompare){
            success = false
            return res.status(400).json({success , error:"Please try to login with correct credentials"})
        }
        const data = {
            user:{
                id:user.id
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET);
        success = true
        res.send({success , authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});

//   ROUTE 3
//   Get the detail of the user: POST "/api/auth/getUser" . Login required
router.post('/getUser',fetchUser, async (req, res)=>{
    let userId = req.user.id;
    try{
        const user = await User.findById(userId).select("-password")
        res.send(user);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});


module.exports = router; 