import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/user/user.model";

dotenv.config();

import { User } from "../model/user/user";

const ACCESS_TOKEN_EXPIRATION = "10m"; // 10 minutes (all for testing purposes)
const REFRESH_TOKEN_EXPIRATION = "1d";  // 1 day (all for testing purposes)

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

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET || "secret",
                { expiresIn: ACCESS_TOKEN_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_REFRESH_TOKEN_SECRET || "verysecret",
                { expiresIn: REFRESH_TOKEN_EXPIRATION }
            );
            delete user.password;
            return {
                ...user,
                accessToken,
                refreshToken
            };
        } else {
            throw new ForbiddenError("Invalid password");
        }
    }

    static async SignOut(): Promise<void> {
        return;
    }

    static async RefreshToken(refreshToken: string) : Promise<{accessToken: string}> {
        if (!refreshToken) {
            throw new BadRequestError("Refresh token is required");
        }
        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET || "verysecret"
            ) as { id: string; role: string };

            const user = await userModel.findUserById(payload.id);
            if (!user) {
                throw new NotFoundError("User not found");
            }
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || "secret",
                { expiresIn: ACCESS_TOKEN_EXPIRATION }
            );
            return { accessToken };
        }
        catch (error) {
            throw new ForbiddenError("Invalid refresh token");
        }
    }

    static async VerifyToken(token: string) {
        if (!token) {
            throw new BadRequestError("Token is required");
        }
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_SECRET || "secret"
            ) as { id: string; role: string };
            return payload;
        } catch (error) {
            throw new ForbiddenError("Invalid token");
        }
    }
}

export default AccessService;
