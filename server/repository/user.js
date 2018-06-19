const path = require("path");
const Users = require(path.join(__dirname, "../../", "/server/database/schemas/user"));

class ServiceRepository {
    static async findAuthenticatedUser(username) {
        return await Users.findOne({
            username: username
        });
    }

    static async userCount(username) {
        return await Users.count({
            username: username
        }).exec();
    }

    static async save(user) {
        return new Users(user).save();
    }
}

module.exports = ServiceRepository;