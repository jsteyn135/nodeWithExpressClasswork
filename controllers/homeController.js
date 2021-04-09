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


module.exports = {
    index: (req,res) =>{
        res.render("index");
    }
}

exports.showIndex = (req,res) => {
    res.render("index");
}