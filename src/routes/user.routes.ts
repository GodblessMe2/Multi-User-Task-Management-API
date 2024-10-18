import * as express from "express";
import { authentication } from "../middlewares/authentication";
import { authorization } from "../middlewares/authorization";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

// User
router.get(
  "/users",
  authentication,
  authorization(["admin"]),
  UserController.getUsers
);
router.get(
  "/userProfile",
  authentication,
  authorization(["user", "admin"]),
  UserController.getProfile
);
router.patch("/userUpdate", authentication, UserController.updateUser);

export { router as userRouter };
