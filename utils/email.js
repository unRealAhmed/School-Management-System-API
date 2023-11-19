const EventEmitter = require('events');
const nodemailer = require('nodemailer');

const emailEventEmitter = new EventEmitter();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fullname.split(' ')[0];
    this.url = url;
    this.from = 'NexSphereShop Team <ahmed@NexSphereShop.io>';
  }

  // Send an email with specified subject and message
  async send(subject, message, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message || '',
      html
    };

    // Emit the 'sendEmail' event with mailOptions
    emailEventEmitter.emit('sendEmail', mailOptions);
  }

  async sendWelcomeEmail() {
    const subject = 'Welcome To NexSphereShop Family 🚀';
    const message = `Hello ${this.firstName}! 🎉

    Welcome to NexSphereShop! We're excited to have you as a valued member of our E-Commerce community. Get ready to explore a wide range of products, enjoy exclusive offers, and immerse yourself in a delightful shopping experience. Together, let's make your shopping journey with NexSphereShop a resounding success! 🌟
    
    Happy shopping!
    The NexSphereShop Team 🌐`;

    await this.send(subject, null, message);
  }

  async sendPasswordResetEmail(html) {
    const subject = "Password Reset Request for Your NexSphereShop Account 🛡️"
    const message = 'hi'
    await this.send(subject, message, html);
  }
};

emailEventEmitter.on('sendEmail', async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASS_KEY,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
