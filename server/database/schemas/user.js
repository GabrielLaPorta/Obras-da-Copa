const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Schemas Mongoose
const UserSchema = Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    hash: {
        type: String
    },
    comments: [{
        type: Schema.ObjectId,
        ref: "Comments"
    }]
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;