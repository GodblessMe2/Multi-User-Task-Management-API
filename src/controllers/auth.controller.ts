import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { UserResponse } from "../dto/user.dto";
import { User } from "../entity/user.entity";
import { encrypt } from "../utils/encrypt";
import { isStrongPassword, isValidEmail } from "../utils/validation";

export class AuthController {
  // Admin and User can log in
  static login: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Check if email is valid
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Email is not valid" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = encrypt.comparePassword(user.password, password);

      if (!isPasswordValid) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      const token = encrypt.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return res
        .status(200)
        .json({ message: "Login successful", success: true, user, token });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create account for user and admin
  static signup: RequestHandler = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if email is valid
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Email is not valid" });
      }

      // check if the password is strong
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least 1 special character, A number, 1 lowercase letter, and 1 uppercase letter. Also it must be minimum of 8 characters and maximum of 20 characters",
        });
      }

      let userRepository = AppDataSource.getRepository(User);
      let exist = await userRepository.findOne({ where: { email } });

      // Check if email already exist in the database
      if (exist) {
        return res.status(400).json({ message: "Email already exist" });
      }

      const encryptedPassword = await encrypt.encryptPass(password);

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = encryptedPassword;
      user.role = "admin";

      await userRepository.save(user);

      const userDataSent = new UserResponse();
      userDataSent.name = user.name;
      userDataSent.email = user.email;
      userDataSent.role = user.role;

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        data: userDataSent,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Admin can create another admin
  static adminCreateAdmin: RequestHandler = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if the email is valid
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Email is not valid" });
      }

      // Check if the password is strong
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least 1 special character, A number, 1 lowercase letter, and 1 uppercase letter. Also it must be minimum of 8 characters and maximum of 20 characters",
        });
      }
      const encryptedPassword = await encrypt.encryptPass(password);

      let userRepository = AppDataSource.getRepository(User);

      // Check if email already exist in the database
      let exist = await userRepository.findOne({ where: { email } });
      if (exist) {
        return res.status(400).json({ message: "Email already exist" });
      }

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = encryptedPassword;
      user.role = "admin";

      await userRepository.save(user);

      const createAdmin = new UserResponse();
      createAdmin.name = user.name;
      createAdmin.email = user.email;
      createAdmin.role = user.role;

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        data: createAdmin,
      });
    } catch (err) {
      next(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
