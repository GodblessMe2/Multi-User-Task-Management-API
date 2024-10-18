import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entity/comment.entity";
import { Task } from "../entity/task.entity";
import { User } from "../entity/user.entity";
import { rabbitMQProducerMiddleware } from "../middlewares/notification";

interface CommentDetails {
  message: string;
}

export class CommentController {
  // Comment on the task
  static createComment: RequestHandler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { message }: CommentDetails = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const taskExist = await taskRepository.findOne({
        where: { id: taskId },
      });

      // Check if task exist
      if (!taskExist) {
        return res.status(404).json({ message: "Task not found" });
      }

      const currentUser = req["currentUser"].id;

      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = new Comment();
      comment.message = message;
      comment.user = currentUser;
      comment.task = taskExist;

      await commentRepository.save(comment);

      // notification
      // Send notification to the company for approve doc
      const data = [
        {
          message: `There is a comment on the task`,
          consumer_id: taskExist.createdBy,
          consumer_id2: taskExist.assignedTo,
        },
      ];

      // Stringify the object into JSON string
      const jsonData = JSON.stringify(data);

      // Send to queue
      rabbitMQProducerMiddleware("comment", jsonData);

      return res.status(200).json({ message: "Comment Created successfully" });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update comment
  static updateComment: RequestHandler = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { message }: CommentDetails = req.body;

      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.findOne({
        where: { id: commentId },
      });

      comment.message = message;

      await commentRepository.save(comment);

      return res
        .status(200)
        .json({ message: "Comment Successfully updated", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get a comment
  static getComment: RequestHandler = async (req, res, next) => {
    try {
      const { commentId } = req.params;

      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.findOne({
        where: { id: commentId },
      });

      return res.status(200).json({
        message: "Comment Successfully updated",
        success: true,
        data: comment,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Admin delete comment
  static adminDeleteComment: RequestHandler = async (req, res, next) => {
    try {
      const { commentId } = req.params;

      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.findOne({
        where: { id: commentId },
      });

      await commentRepository.remove(comment);

      return res
        .status(204)
        .json({ message: "Comment Deleted", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // User(Creator) delete comment
  static deleteComment: RequestHandler = async (req, res, next) => {
    try {
      const currentUser = req["currentUser"].id;
      const { commentId } = req.params;
      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.findOne({
        where: { user: { id: currentUser.id }, id: commentId },
      });

      await commentRepository.remove(comment);

      return res
        .status(204)
        .json({ message: "Comment Deleted", success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
