import amqp from 'amqplib';
import { Notification } from '../models/Notification.js';
import { EXCHANGES, QUEUES } from '../../../../shared/event-contracts/habitEvents.js';
import { DuoNotificationEngine } from '../utils/duoNotificationEngine.js';

export const startNotificationConsumer = async () => {
  const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGES.HABIT_EVENTS, 'topic', { durable: true });
    const q = await channel.assertQueue(QUEUES.NOTIFICATIONS_HABIT_COMPLETED, { durable: true });

    // Bind queue to all habit event patterns (completed and created)
    await channel.bindQueue(q.queue, EXCHANGES.HABIT_EVENTS, 'habit.*.v1');

    console.log(`👂 [Notification Service] Listening on RabbitMQ queue: ${QUEUES.NOTIFICATIONS_HABIT_COMPLETED}`);

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        console.log(`📥 [Event Received in Notification Service] ${event.eventType}:`, event.payload);

        const { userId } = event.payload || {};

        if (userId) {
          // Generate rich Duolingo-style milestone / achievement data
          const duoData = DuoNotificationEngine.generateNotification(event.eventType, event.payload);

          // Save rich gamified notification in MongoDB
          await Notification.create({
            userId,
            title: duoData.title,
            message: duoData.message,
            type: duoData.type,
            icon: duoData.icon,
            level: duoData.level,
            xpEarned: duoData.xpEarned,
            habitTitle: duoData.habitTitle,
          });

          console.log(`✨ [Duo Notification Created] for user ${userId}: "${duoData.title}" (${duoData.level || 'Milestone'})`);
        }

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