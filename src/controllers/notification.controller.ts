import { RequestHandler } from "express";

export const createNotification: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const queueName = req.body.queueName;
    const message = req.body.message;
    const consumer_id = req.body.consumer_id;
    const consumer_id2 = req.body.consumer_id2;

    const newNotification = {
      queueName,
      message,
      consumer_id,
      consumer_id2,
    };

    res.status(200).json({
      data: newNotification,
    });
  } catch (err) {
    next(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
