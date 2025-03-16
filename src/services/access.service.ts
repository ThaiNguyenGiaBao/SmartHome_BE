import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/user/user.model";
dotenv.config();

import { User } from "../model/user/user";

class AccessService {
    static async SignUp({ username, email, password }: User) {
        if (!email || !username || !password) {
            throw new BadRequestError("Email, username, password are required");
        }

        // check if email is already used
        const user = await userModel.findUserByEmail(email);
        if (user) {
            throw new BadRequestError("Email is already used");
        }
        const avatarUrl = "https://avatar.iran.liara.run/username?username=" + username;

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.createUser({
            username,
            email,
            password: hashedPassword,
            avatarUrl
        });

        return result;
    }

    static async SignIn({ email, password }: { email: string; password: string }) {
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }
        console.log("AccessService::SignIn", email);
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret");
            delete user.password;
            return {
                ...user,
                accessToken
            };
        } else {
            throw new ForbiddenError("Invalid password");
        }
    }
}

export default AccessService;