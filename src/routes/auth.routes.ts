import * as express from "express";
import { authentication } from "../middlewares/authentication";
import { authorization } from "../middlewares/authorization";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post(
  "/createAdmin",
  authentication,
  authorization(["admin"]),
  AuthController.adminCreateAdmin
);
router.post("/login", AuthController.login);

export { router as authRouter };
