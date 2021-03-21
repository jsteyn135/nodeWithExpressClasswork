var courses =[
    {
        title:"rasperry Cake",
        cost: 50
    },
    {
        title:"artichoke",
        cost: 20
    },
    {
        title:"burger",
        cost: 100
    },

]



exports.showCourses = (req,res) => {
    res.render("courses",{offeredCourses: courses});
}

exports.showSignup = (req,res) => {
    res.render("contact");


}


exports.postedSignUpForm = (req,res) => {
    res.render("thanks");
}

exports.showIndex = (req,res) => {
    res.render("index");
}