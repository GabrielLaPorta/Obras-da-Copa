const mongoose = require("mongoose");
const path = require("path");

const commentRepository = require(path.join(__dirname, "../../", "/server/repository/comment"));
const config = require(path.join(__dirname, "../../", "/server/config"));

class commentService {
    static async getAll(userId) {
        try {
            await mongoose.connect(config.databaseUrl);

            const commentList = await commentRepository.getAll();

            return commentList.map(comment => {
                const isOwner = userId === comment.userId;

                comment.delete = isOwner;
                comment.update = isOwner;

                return comment;
            });
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }

    static async save(userId, comment, username) {
        try {
            await mongoose.connect(config.databaseUrl);

            return await commentRepository.save(userId, comment, username);
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }

    static async update(commentId, comment) {
        try {
            await mongoose.connect(config.databaseUrl);

            return await commentRepository.update(commentId, comment);
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }

    static async delete(userId, commentId) {
        try {
            await mongoose.connect(config.databaseUrl);

            return await commentRepository.delete(userId, commentId);
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }
}

module.exports = commentService;