const mongoose = require("mongoose"),
{Schema } =  require("mongoose"),

courseSchema =  new Schema (
    {
        title:{
            type: String,
            required: true,
            unqiue: true,
        },
        description:{
            type: String,
            required: true,

        },
        maxStudents: {
            type: Number,
            default: 0,
            min : [0, "Course cannot have negative number of students!"]
        },
        cost:{
            type:Number,
            default: 0,
            min: [0,"costs cannot be negative!"]
        }

    },
    {

        timeStamps: true,
    }




)



module.exports =  mongoose.model("Course",courseSchema);