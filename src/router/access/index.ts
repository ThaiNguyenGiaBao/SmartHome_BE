import express from "express";
import AccessController from "../../controllers/access.controller";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";

const router = express.Router();
router.post("/signup", asyncHandler(AccessController.SignUp));
router.post("/signin", asyncHandler(AccessController.SignIn));

router.use(asyncHandler(authenticateToken));

// /api/auth/
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

export default router;
