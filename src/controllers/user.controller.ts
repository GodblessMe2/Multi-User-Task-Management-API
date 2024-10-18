import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user.entity";

export class UserController {
  static getProfile: RequestHandler = async (req, res, next) => {
    try {
      if (!req["currentUser"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: req["currentUser"].id },
      });

      return res
        .status(200)
        .json({ ...user, password: undefined, success: true });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  static getUsers: RequestHandler = async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const users = await userRepository.find();

      return res.status(200).json({
        data: users,
        success: true,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  static updateUser: RequestHandler = async (req, res, next) => {
    try {
      if (!req["currentUser"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: req["currentUser"].id },
      });

      user.name = name;
      await userRepository.save(user);
      return res.status(200).json({
        message: "update",
        user,
        success: true,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
