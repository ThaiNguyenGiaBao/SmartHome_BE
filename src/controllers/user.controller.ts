import { Request, Response } from "express";
import { OK, Created, SuccessResponse } from "../helper/successResponse";
import UserService from "../services/user.service";
import { ForbiddenError } from "../helper/errorRespone";

class UserController {
    //router.get("/:userId", asyncHandler(UserController.getUser));
    static async getUser(req: Request, res: Response) {
        console.log("GetUserProfile::", req.params);


        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to access this resource");
        }
        return new SuccessResponse({
            message: "Get user profile successfully",
            data: await UserService.getUser(req.params.userId)
        }).send(res);
    }

    //router.get("/me", asyncHandler(UserController.getUser));
    static async getMe(req: Request, res: Response) {
        console.log("GetMe::");

            return new SuccessResponse({
                message: "Get user profile successfully",
                data: await UserService.getUser(req.user.id)
            }).send(res);
        

    }

    static async getAllUsers(req: Request, res: Response) {
        console.log("GetAllUsers::", req.query);
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        if (req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to get all users");
        }
        return new OK({
            message: "Get all users successfully",
            data: await UserService.getAllUsers({ page, limit })
        }).send(res);
    }

    // router.patch("/update/:userId", asyncHandler(UserController.updateUser));
    static async updateUser(req: Request, res: Response) {
        console.log("UpdateUserProfile::", req.params, req.body);
        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to update this resource");
        }
        return new OK({
            message: "Update user profile successfully",
            data: await UserService.updateUser(req.params.userId, req.body)
        }).send(res);
    }

    // // router.delete("/:userId", asyncHandler(UserController.deleteUser));
    static async deleteUser(req: Request, res: Response) {
        console.log("DeleteUserProfile::", req.params);
        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to delete this resource");
        }
        return new OK({
            message: "Delete user successfully",
            data: await UserService.deleteUser(req.params.userId)
        }).send(res);
    }
}

export default UserController;
