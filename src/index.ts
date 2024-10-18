import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import "reflect-metadata";
import { taskRouter } from "./routes/task.routes";
import { commentRouter } from "./routes/comment.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notificationRouter } from "./routes/notification.routes";

dotenv.config();

const app = express();

app.use(express.json());

const { PORT = 8200 } = process.env;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/notification", notificationRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    console.log("Data Source has been initialized.");
  })
  .catch((error) => console.log(error));
