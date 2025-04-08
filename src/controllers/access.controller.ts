import AccessService from "../services/access.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError } from "../helper/errorRespone";


class AccessController {
    static async SignUp(req: Request, res: Response) {
        console.log("AccessController::SignUp", req.body);

        const { username, email, password } = req.body;
        
        return new Created({
            message: "User created successfully",
            data: await AccessService.SignUp({
                username,
                email,
                password
            })
        }).send(res);
    }

    static async SignIn(req: Request, res: Response) {
        console.log("AccessController::SignIn", req.body);
        const data = await AccessService.SignIn(req.body);
        return new OK({
            message: "User signed in successfully",
            data: data
        }).send(res);
    }

    static async SignOut(req: Request, res: Response) {
        console.log("AccessController::SignOut", req.body);
        
        await AccessService.SignOut();

        return new OK({
            message: "User signed out successfully",
            data: null
        }).send(res);
    }

    static async RefreshToken(req: Request, res: Response) {
        console.log("AccessController::RefreshToken", req.body);
        const refreshToken = req.body.refreshToken;
        
        if (!refreshToken) {
            throw new BadRequestError("Refresh token is required");
        }
        
        const data = await AccessService.RefreshToken(refreshToken);

        return new OK({
            message: "Token refreshed successfully",
            data: data
        }).send(res);
    }
}

export default AccessController;
