import amqp from 'amqplib';
import { EXCHANGES } from '../../../../shared/event-contracts/habitEvents.js';

let channel = null;

export const connectRabbitMQ = async () => {
  const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGES.HABIT_EVENTS, 'topic', { durable: true });
    console.log(`📡 [Habit Service] RabbitMQ publisher connected to exchange: ${EXCHANGES.HABIT_EVENTS}`);

    connection.on('error', (err) => {
      console.error('RabbitMQ publisher connection error:', err.message);
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on('close', () => {
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (error) {
    console.warn(`⚠️ [Habit Service] RabbitMQ connect retry in 5s: ${error.message}`);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const publishEvent = (routingKey, event) => {
  if (!channel) {
    console.warn(`⚠️ [Habit Service] RabbitMQ channel offline, skipping event: ${routingKey}`);
    return false;
  }

  try {
    const payloadBuffer = Buffer.from(JSON.stringify(event));
    channel.publish(EXCHANGES.HABIT_EVENTS, routingKey, payloadBuffer, {
      persistent: true,
      contentType: 'application/json',
    });
    console.log(`📤 [Event Published] ${routingKey}:`, event.payload);
    return true;
  } catch (err) {
    console.error('Failed to publish RabbitMQ event:', err.message);
    return false;
  }
};
