import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (to, html) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();
  //   console.log('test account: ', JSON.stringify(testAccount, null, 2));
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${process.env.ADMIN_GMAIL}`, // generated ethereal user
      pass: `${process.env.ADMIN_GMAIL_PASSWORD}`, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Testing Graphql" <Coh.jr11@gmail.com>', // sender address
    to, // list of receivers
    subject: 'Reset your password!', // Subject line
    text: 'Please visit the attached link!', // plain text body
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
