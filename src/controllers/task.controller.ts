import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entity/task.entity";
import { User } from "../entity/user.entity";
import { Comment } from "../entity/comment.entity";
import { TaskStatus, TaskTag } from "../entity/task.entity";
import APIQuery from "../utils/apiQuery";
import { rabbitMQProducerMiddleware } from "../middlewares/notification";

interface TaskDetails {
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  tags: TaskTag[];
}

export class TaskController {
  // Get all Tasks
  static getAllTask: RequestHandler = async (req, res, next) => {
    try {
      const taskRepository = AppDataSource.getRepository(Task);

      let query = taskRepository.createQueryBuilder("task");
      const apiQuery = new APIQuery(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      // Execute the query
      const tasks = await apiQuery.query.getMany();

      return res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get a single Task
  static getTask: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      return res.status(200).json({
        message: "Get Task Successfully",
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get Tag Task
  static getTagTask: RequestHandler = async (req, res, next) => {
    try {
      const { tag } = req.params;

      const taskRepository = AppDataSource.getRepository(Task);

      const tagTasks = await taskRepository
        .createQueryBuilder("task")
        .where(":tag = ANY (task.tags)", { tag })
        .getMany();

      return res.status(200).json({
        data: tagTasks,
        success: true,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create a task
  static createTask: RequestHandler = async (req, res, next) => {
    try {
      const { title, description, dueDate, status, tags }: TaskDetails =
        req.body;

      if (!title || !description || !dueDate) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const currentUser = req["currentUser"].id;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = new Task();
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.status = status;
      task.tags = tags;
      task.createdBy = currentUser;

      await taskRepository.save(task);

      return res.status(200).json({ message: "Task Created successfully" });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Assign A Task
  static assignTask: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { email } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOne({
        where: { email },
      });

      // check if the user exist if not throw not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      // Check if the task exist
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.assignedTo = user;

      // Send notification to the company for approve doc
      const data = [
        {
          message: `A task as been assigned to you`,
          consumer_id: user.id,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("assigned", jsonData);

      await taskRepository.save(task);

      return res.status(200).json({ message: "Assigned Task successfully" });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update tag
  static tagToTask: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { tags } = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.tags = [tags];

      // Send notification to the company for approve doc
      const data = [
        {
          message: `A tag was issued for this task`,
          consumer_id: task.createdBy,
          consumer_id2: task.assignedTo,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("tagTask", jsonData);

      await taskRepository.save(task);

      return res.status(200).json({ message: "Tags added successfully" });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update Task
  static updateTask: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { title, description, dueDate, status }: TaskDetails = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.status = status;

      // Send notification to the company for approve doc
      const data = [
        {
          message: `A an update has been made for this task`,
          consumer_id: task.createdBy,
          consumer_id2: task.assignedTo,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("updateTask", jsonData);

      await taskRepository.save(task);

      return res
        .status(200)
        .json({ message: "Task Successfully updated", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Admin update Status
  static adminUpdateStatus: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { status }: TaskDetails = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      task.status = status;

      await taskRepository.save(task);

      // notification
      // Send notification to the company for approve doc
      const data = [
        {
          message: `The status of the task has changed ${status}`,
          consumer_id: task.createdBy,
          consumer_id2: task.assignedTo,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("updateStatusTask", jsonData);

      return res
        .status(200)
        .json({ message: "Status Task changed", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // User update status
  static userUpdateStatus: RequestHandler = async (req, res, next) => {
    try {
      const currentUser = req["currentUser"].id;
      const { taskId } = req.params;

      const { status }: TaskDetails = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { assignedTo: { id: currentUser.id }, id: taskId },
      });

      if (!task) {
        return res.status(404).json({ message: "No task found" });
      }

      task.status = status;

      await taskRepository.save(task);

      // notification
      // Send notification to the company for approve doc
      const data = [
        {
          message: `The status of the task has changed ${status}`,
          consumer_id: task.createdBy,
          consumer_id2: task.assignedTo,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("updateStatusTask", jsonData);

      return res
        .status(200)
        .json({ message: "Status Task changed", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delate Task
  static deleteTask: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id: taskId },
      });

      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.find({
        where: { task },
      });

      await commentRepository.remove(comment);

      await taskRepository.remove(task);

      return res.status(204).json({ message: "Task Deleted", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
