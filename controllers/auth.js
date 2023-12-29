const mysql = require("mysql")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req,res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    db.query('select email from users where email = ?',[email],(error,results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0)
        {
            return res.render('register',{
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm)
        {
            return res.render('register',{
                message: 'Passwords do not match'
            })
        }
    });

    res.send("Form Submitted")
}