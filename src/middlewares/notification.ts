import * as amqp from "amqplib";
import { Request, Response, NextFunction } from "express";

// RabbitMQ connection URL
const rabbitMQUrl: string = "amqp://localhost";

interface Message {
  message: string;
  consumer_id: string;
  consumer_id2: string;
}

export const rabbitMQProducerMiddleware = async (
  queueName: string,
  message: string
): Promise<void> => {
  try {
    // Connect RabbitMQ
    const connection = await amqp.connect(rabbitMQUrl);
    // Create Channel
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to ${queueName}: ${message}`);

    //  Close Channel and connection
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("RabbitMQ Producer Error:", err);
    throw err;
  }
};

export const rabbitMQConsumerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const exchanges: string[] = JSON.parse(process.env.EXCHANGE || "[]");

    await Promise.all(
      exchanges.map(async (queueName: string) => {
        // Connect RabbitMQ Server
        const connection = await amqp.connect(rabbitMQUrl);
        //  Create Channel
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);

        // Consume messages
        channel.consume(queueName, async (msg) => {
          if (msg !== null) {
            const data: Message[] = JSON.parse(msg.content.toString());

            // Iterate over the array
            data.forEach((el) => {
              req.body.message = el.message;
              req.body.consumer_id = el.consumer_id;
              req.body.consumer_id2 = el.consumer_id2;
            });

            req.body.queueName = queueName;
            console.log(
              `Received message from ${queueName}: ${msg.content.toString()}`
            );

            // Acknowledge message
            channel.ack(msg);
          }
        });
      })
    );

    next();
  } catch (error) {
    console.error("RabbitMQ Consumer Error:", error);
    res.status(422).json({ err: error.message });
  }
};
