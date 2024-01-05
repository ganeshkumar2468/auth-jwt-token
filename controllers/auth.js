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
    db.query('select email from users where email = ?',[email],async (error,results) => {
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

        let hashedPassword = await bcrypt.hash(password,8)
        console.log(hashedPassword);

        db.query('insert into users set ?',{name:name, email:email, password:hashedPassword},(error,results)=>{
                    if(error)
                    {
                        console.log(error);
                    } else{
                        return res.render('register',{
                            message:'user registered'
                        })
                    }
        })
    });

}

exports.login = (req,res) => {
    console.log(req.body);
    const { username , password } = req.body;
    db.query('select email,password from users where email = ?',[username],async (error,results) => {        
        if(error){
            console.log(error);
        }
        if(results.length>0)
        {
            return res.render('login',{
                message: 'Successfully login'
            })
        }
        else{
            return res.render('login',{
                message: 'Invalid credentials'
            })
        }
    });
}