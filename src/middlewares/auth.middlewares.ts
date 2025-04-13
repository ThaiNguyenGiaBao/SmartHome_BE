import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: string;
            };
        }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is required" });
    }
    jwt.verify(accessToken, process.env.JWT_SECRET || "secret", async (err: jwt.VerifyErrors | null, member: any) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" }); 
            }
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = member as { id: string; role: string };
        console.log("User authenticated::", req.user);
        next();
    });
};

export { authenticateToken };
