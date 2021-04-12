"use strict"

const { render } = require("ejs");
const Subscriber = require("../models/subscriber");






module.exports = {
    index: (req, res, next) => {
        Subscriber.find()
            .then(subscribers => {
                res.locals.subscribers = subscribers;
                next();
            })
            .catch(error => {

                console.log(`error fetching subscriber data: ${error.message}`);
                next(error);
            })
    },
    indexView: (req, res) => {
        res.render("../views/subscribers/index");
    },
    new: (req, res) => {
        res.render("../views/subscribers/new");
    },
    create: (req, res, next) => {
        let newSubscriber = new Subscriber({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode,
        });
        Subscriber.create(newSubscriber)
            .then(subscriber => {

                res.locals.subscriber = subscriber;
                res.locals.redirect = "/subscribers";
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

        let subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber => {
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error => {
                console.log(`error fetching subscriber by ID: ${error.message}`);
            })

    },
    showView: (req, res) => {

        res.render("subscribers/show");

    },
    edit: (req, res, next) => {
        let subscriberId = req.params.id;
        console.log("asdasdasdasdasd");
        Subscriber.findById(subscriberId)
            .then(subscriber => {
                res.render("subscribers/edit", { subscriber: subscriber });
            })
            .catch(error => {
                console.log(`error fetchign subscriber by id: ${error.message}`);
                next(error);
            })
    },
    update: (req, res, next) => {
        let subscriberId = req.params.id;
        
        Subscriber.findByIdAndUpdate(subscriberId, {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode,

        })
            .then(subscriber => {
                res.locals.subscriber = subscriber;
                res.locals.redirect = `/subscribers/${subscriber._id}`;
                next();

            })
            .catch(error => {

                console.log(`error fetchign user by id: ${error.message}`);
                next();
            })
    },
    delete: (req, res, next) => {
        let subscriberId = req.params.id;
        Subscriber.findByIdAndRemove(subscriberId)
            .then(() => {
                res.locals.redirect = "/subscribers";
                next();
            })
            .catch(error => {
                console.log(`error fetchign user by id: ${error.message}`);
            })
    }
}