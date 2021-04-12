"use strict"

const { render } = require("ejs");
const User = require("../models/user");






module.exports = {
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
        let newUser = new User({
            name:{
                first: req.body.first,
                last: req.body.last,
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode,
        });
        User.create(newUser)
            .then(user => {

                res.locals.user = user;
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`error saving user: ${error.message} `);
                next(error);
            })

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