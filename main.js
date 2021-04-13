//const cookieParser = require("cookie-parser");
//const { Cookie } = require("express-session");


const express = require("express"), app = express();
router = express.Router(),

passport = require("passport");
cookieParser = require("cookie-parser");
expressSession = require("express-session");
expressValidator = require("express-validator");
connectFlash = require("connect-flash");
User = require("./models/user");
router.use(expressValidator());



homeController = require("./controllers/homeController");
errorController = require("./controllers/errorController"),
subscribersController = require("./controllers/subscribersController"),
coursesController = require("./controllers/coursesController"),
usersController = require("./controllers/usersController"),
methodOverride = require("method-override");








layouts = require("express-ejs-layouts");
mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/confetti_cuisine",{useNewUrlParser: true});


app.set("port", process.env.PORT || 3000);
app.set("view engine","ejs");
router.use(layouts);



router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





router.use(methodOverride("_method", {methods:["POST","GET"]}));
router.get("/",homeController.index);



router.get("/subscribers",subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new",subscribersController.new);
router.post("/subscribers/create",subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/courses",coursesController.index, coursesController.indexView);
router.get("/courses/new",coursesController.new);
router.post("/courses/create",coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);


router.get("/users",usersController.index, usersController.indexView);
router.get("/users/new",usersController.new);
router.post("/users/create",usersController.validate,usersController.create, usersController.redirectView);
router.get("/users/login",usersController.login);
router.post("/users/login",usersController.authenticate);
router.get("/users/logout",usersController.logout,usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.validate,usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);











router.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false

    })
);

router.use(express.json());

router.use(cookieParser("my_passcode"));
router.use(expressSession({
    secret: "my_passcode",
    cookie: {
        maxAge: 360000

    },
    resave: false,
    saveUnitiialized: false

}));

router.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    
});

router.use(connectFlash());






router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);



app.use("/", router);



app.listen(app.get("port"), () => {
    console.log(`Server is running on port: ${app.get("port")}`);
});




