import AccessService from "../services/access.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { token } from "morgan";

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
        res.cookie("token", data.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
        return new OK({
            message: "User signed in successfully",
            data: data
        }).send(res);
    }
}

export default AccessController;
