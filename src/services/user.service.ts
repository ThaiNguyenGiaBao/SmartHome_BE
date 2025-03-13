import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import { checkUUID } from "../utils";
import UserModel from "../model/user/user.model";

class UserService {
    static async getUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }
        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    static async getAllUsers({ page, limit }: { page: number; limit: number }) {
        const users = await UserModel.getAllUsers({ page, limit });
        return users;
    }

    // // // router.patch("/:userId", asyncHandler(UserController.updateUser));

    static async updateUser(
        userId: string,
        {
            email,
            username,
            password,
            avatarUrl,
            phoneNum,
            dob
        }: { email?: string; username?: string; password?: string; avatarUrl?: string; phoneNum?: string; dob?: string }
    ) {
        console.log("UpdateUserProfile::", userId, email, username, password, avatarUrl, phoneNum, dob);
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }

        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Prepare update query parts

        const updatedUser = await UserModel.updateUser(userId, {
            email,
            username,
            password,
            avatarUrl,
            phoneNum,
            dob
        });
        console.log("Updated user", updatedUser);
        return updatedUser;
    }

    // // // router.delete("/:userId", asyncHandler(UserController.deleteUser));

    static async deleteUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }

        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const deletedUser = await UserModel.deleteUser(userId);
        return deletedUser;
    }
}

export default UserService;
