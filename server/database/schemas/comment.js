const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Schemas Mongoose
const commentSchema = Schema({
    comment: {
        type: String
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String
    },
    userId: {
        type: String
    }
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;