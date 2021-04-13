"use strict"

const { render } = require("ejs");
const User = require("../models/user");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const connectFlash = require("connect-flash");


let getUserParams = body => {
    return {
        name:{
            first: body.first,
            last: body.last,
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode,
    };
};







module.exports = {

    login: (req,res) =>{
        res.render("users/login");
    },

    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {

                console.log(`error fetching user data: ${error.message}`);
                next(error);
            })
    },
    indexView: (req, res) => {
        res.render("../views/users/index");
    },
    new: (req, res) => {
        res.render("../views/users/new");
    },
    create: (req, res, next) => {
        if(req.skip) return next();
        let userParams = getUserParams(req.body);

        let newUser = new User(userParams);


        User.register(newUser, req.body.password, (error, user)=> {
            if(user){
                req.flash("success","User Account successfully created!");
                res.locals.redirect = "/users";
                next();
            }
            else{
                req.flash("error",`failed to create user account: ${error.message}`);
                res.locals.redirect = "/users/new";
                next();
            }
        });
    },

    validate: (req,res,next) => {

        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true,
        }).trim();


        req.check("email","email is not valid!").isEmail();
        req.check("zipCode","zipCode is not valid!").notEmpty().isInt().isLength({
            min: 5,
            max: 5,
        });
        req.check("password","password cannot be empty").notEmpty();
        req.getValidationResult().then((error) => {
            if(!error.isEmpty()){
                let messages = error.array().map( e => e.msg);
                req.flash("error",messages.join(" and "));
                req.skip = true;
                res.locals.redirect = "/users/new";
                next();
            }
            else{
                next();
            }
        });
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Login failed! check your email or password! ",
        successRedirect: "/",
        sucessFlash: "Logged in!",

    }),

    logout : (req,res,next) => {

        req.logout();
        req.flash("success","you have been logged out!");
        res.locals.redirect = "/";
        next();
    },


    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {

        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`error fetching user by ID: ${error.message}`);
            })

    },
    showView: (req, res) => {

        res.render("users/show");

    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        //console.log("req.params.id = "+req.params.id);
        User.findById(userId)
            .then(user => {
                res.render("users/edit", { user: user });
            })
            .catch(error => {
                
                console.log(`error fetchign user by id: ${error.message}`);
                next(error);
            })
    },
    update: (req, res, next) => {
        if(req.skip) return next();


        let userId = req.params.id;
        User.findOneAndUpdate(userId, {
            name:{
                first: req.body.first,
                last: req.body.last,
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode,

        })
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = `/users/${user._id}`;
                
                next();

            })
            .catch(error => {// mega errors here
                
                console.log(`error fetchign user by id: ${error.message}`);
                next();
            })
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`error fetchign user by id: ${error.message}`);
            })
    }
}