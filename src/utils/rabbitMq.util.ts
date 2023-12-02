import amqp, { Channel } from "amqplib";
import nodemailer from 'nodemailer';

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kendall.grimes@ethereal.email',
        pass: '2WcQTESVc2mGktHuws'
    }
  });

// Set up RabbitMQ connection
const RABBITMQ_URL: string = process.env.RABBITMQ_URL || '';
const QUEUE_NAME: string = process.env.QUEUE_NAME || '';

export async function setupRabbitMQ(): Promise<Channel> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  return channel;
}

export async function startEmailConsumer() {
    console.log('Email consumer started');
    
    const channel = await setupRabbitMQ();
  
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const { to, subject, text } = JSON.parse(msg.content.toString());
  
        try {
          // Send the email
          await transporter.sendMail({
            from: 'kendall.grimes@ethereal.email',
            to,
            subject,
            text,
          });
  
          console.log('Email sent successfully:', { to, subject, text });
        } catch (error) {
          console.error('Error sending email:', error);
        }
  
        // Acknowledge the message to remove it from the queue
        channel.ack(msg);
      }
    });
  }
  