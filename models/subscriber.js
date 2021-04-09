const mongoose = require("mongoose"),
Course =  require("./course");
    subscriberSchema = mongoose.Schema({

        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unqiue: true,
        },

        zipCode: {
            type: Number,
            required: true,
            min: [10000, "ZIP CODE TOO SHORT"],
            max: 99999,
        },
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: Course }]

    }, {

        timeStamps: true,
    });

subscriberSchema.methods.getInfo = function(){
    return `Name: ${this.name} Email: ${this.email} Zipcode: ${this.zipCode}`;
}

module.exports = mongoose.model("subscriber", subscriberSchema);









