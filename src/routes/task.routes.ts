import * as express from "express";
import { authorization } from "../middlewares/authorization";
import { authentication } from "../middlewares/authentication";
import { TaskController } from "../controllers/task.controller";

const router = express.Router();

router.get("/getTasks", authentication, TaskController.getAllTask);

router.get("/getTask/:taskId", authentication, TaskController.getTask);

router.get("/getTagTasks/:tag", authentication, TaskController.getTagTask);

router.post("/create", authentication, TaskController.createTask);

router.put("/updateTag/:taskId", authentication, TaskController.tagToTask);

router.put("/assignTask/:taskId", authentication, TaskController.assignTask);

router.put("/updateTask/:taskId", authentication, TaskController.updateTask);

router.put(
  "/updateTaskStatus/:taskId",
  authentication,
  authorization(["admin"]),
  TaskController.adminUpdateStatus
);

router.put(
  "/updateTaskByUser/:taskId",
  authentication,
  authorization(["user"]),
  TaskController.userUpdateStatus
);

router.delete(
  "/deleteTask/:taskId",
  authentication,
  authorization(["admin"]),
  TaskController.deleteTask
);

export { router as taskRouter };
