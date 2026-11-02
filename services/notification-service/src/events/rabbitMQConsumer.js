import amqp from 'amqplib';
import { Notification } from '../models/Notification.js';
import { EXCHANGES, QUEUES } from '../../../../shared/event-contracts/habitEvents.js';

export const startNotificationConsumer = async () => {
  const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGES.HABIT_EVENTS, 'topic', { durable: true });
    const q = await channel.assertQueue(QUEUES.NOTIFICATIONS_HABIT_COMPLETED, { durable: true });

    // Bind queue to all habit event patterns
    await channel.bindQueue(q.queue, EXCHANGES.HABIT_EVENTS, 'habit.*.v1');

    console.log(`👂 [Notification Service] Listening on RabbitMQ queue: ${QUEUES.NOTIFICATIONS_HABIT_COMPLETED}`);

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        console.log(`📥 [Event Received in Notification Service] ${event.eventType}:`, event.payload);

        const { userId, date } = event.payload;

        // Auto-create celebration notification in MongoDB
        await Notification.create({
          userId,
          title: 'Habit Completed! 🎯',
          message: `Awesome job! You marked your habit completed for ${date}. Keep the streak going!`,
          type: 'milestone',
        });

        // Acknowledge message successfully processed
        channel.ack(msg);
      } catch (err) {
        console.error('Error processing notification event:', err.message);
        channel.nack(msg, false, false);
      }
    });

    connection.on('error', (err) => {
      console.error('RabbitMQ consumer connection error:', err.message);
      setTimeout(startNotificationConsumer, 5000);
    });
  } catch (error) {
    console.warn(`⚠️ [Notification Consumer] RabbitMQ retry in 5s: ${error.message}`);
    setTimeout(startNotificationConsumer, 5000);
  }
};