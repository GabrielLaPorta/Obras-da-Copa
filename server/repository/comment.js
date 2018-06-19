const path = require("path");

const Users = require(path.join(__dirname, "../../", "/server/database/schemas/user"));
const Comments = require(path.join(__dirname, "../../", "/server/database/schemas/comment"));

class commentRepository {
    static async getAll() {
        const response = Comments
            .find()
            .sort({
                "dateTime": -1
            })
            .lean()
            .exec();

        return response;
    }

    static async save(userId, comment, username) {
        const newComment = new Comments();

        newComment.comment = comment;
        newComment.userId = userId;
        newComment.username = username;

        await newComment.save();

        const findUser = await Users.findById({
            _id: userId
        }).exec();

        findUser.comments.push(newComment);

        return await findUser.save();
    }

    static async update(commentId, comment) {
        const newComment = await Comments.findById({
            _id: commentId
        }).exec();

        newComment.comment = comment;
        newComment.dateTime = Date.now();

        return await newComment.save();
    }

    static async delete(userId, commentId) {
        const commentRemoved = await Comments.findOneAndRemove({
            _id: commentId
        }).exec();

        await Users.findByIdAndUpdate({
            _id: userId
        }, {
            $pull: {
                comments: {
                    $in: [commentId]
                }
            }
        });

        return commentRemoved;
    }
}

module.exports = commentRepository;