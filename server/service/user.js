const mongoose = require("mongoose");
const path = require("path");
const pass = require("pwd");

const ServiceRepository = require(path.join(__dirname, "../../", "/server/repository/user"));
const config = require(path.join(__dirname, "../../", "/server/config"));

class UserService {
    static logOut(session) {
        try {
            return session.destroy();
        } catch (error) {
            return error;
        }
    }

    static async save(username, password) {
        try {
            await mongoose.connect(config.databaseUrl);

            const crypto = await pass.hash(password);
            const savedUser = await ServiceRepository.save({
                username: username,
                salt: crypto.salt,
                hash: crypto.hash,
            });

            return await UserService.authenticate(savedUser.username, password);
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }

    static createUserSession(session, user) {
        const promise = new Promise((resolve, reject) => {
            session.save(() => {
                session.user = user;
                resolve();
            });
        });

        return promise;
    }

    static async authenticate(username, password) {
        try {
            await mongoose.connect(config.databaseUrl);

            const user = await ServiceRepository.findAuthenticatedUser(username);

            if (user && await UserService.checkAuthentication(user, password)) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }

    static async checkAuthentication(user, password) {
        const crypto = await pass.hash(password, user.salt);

        return crypto.hash === user.hash;
    }

    static async userExist(username) {
        try {
            await mongoose.connect(config.databaseUrl);

            const userCount = await ServiceRepository.userCount(username);

            return userCount === 0;
        } catch (error) {
            return error;
        } finally {
            if (mongoose && mongoose.connection) {
                await mongoose.connection.close();
            }
        }
    }
}

module.exports = UserService;