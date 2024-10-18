import * as express from "express";
import { authorization } from "../middlewares/authorization";
import { authentication } from "../middlewares/authentication";
import { CommentController } from "../controllers/comment.controller";

const router = express.Router();

router.post("/create/:taskId", authentication, CommentController.createComment);

router.put(
  "/updateComment/:commentId",
  authentication,
  CommentController.updateComment
);

router.get(
  "/getComment/:commentId",
  authentication,
  CommentController.getComment
);

router.delete(
  "/deleteComment/:commentId",
  authentication,
  authorization(["user"]),
  CommentController.deleteComment
);

router.delete(
  "/deleteCommentByAdmin/:commentId",
  authentication,
  authorization(["admin"]),
  CommentController.adminDeleteComment
);

export { router as commentRouter };
