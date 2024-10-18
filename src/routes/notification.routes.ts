import * as express from "express";
import { rabbitMQConsumerMiddleware } from "../middlewares/notification";
import { authorization } from "../middlewares/authorization";
import { createNotification } from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/getNotification",
  authorization,
  rabbitMQConsumerMiddleware,
  createNotification
);

export { router as notificationRouter };
