const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');



// Create user
const createUser = async(req, res = response) => {
    const { email, password, gym } = req.body;

    
    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'User already exists'
            });
        }

        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        //Generate cookie
        res.cookie('myCookieToken', 'cookieToken',{
            maxAge: 36000000,
            httpOnly: true,
            secure: true,
            httpOnly: true,
            sameSite: 'lax'
        });
       
        // Create user OK
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            gym: user.gym,
            token,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });    
    }
};
// Login user
const loginUser = async(req, res = response) => {
    const { email, password } = req.body;
    
    try {
        // Check if email exists
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'email or password are not correct'
            });
        }

        //check password is correct
        const validPassword = bcrypt.compareSync(password, user.password);  

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'eamil or password are not correct'
            });
        }

       const token = await generateJWT(user.id, user.name);

        // Login OK
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            gym: user.gym,
            token,
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
};
//Reenew token JWT
const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // Generate JWT
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        uid,
        name,
        token
    })
};




module.exports = {
    createUser,
    loginUser,
    renewToken
}