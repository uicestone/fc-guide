import nodemailer from "nodemailer";

export default async function sendEmail(to) {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtpdm.aliyun.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_ACCOUNT,
        pass: process.env.SMTP_PASS
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Guide Booking System" <${process.env.SMTP_ACCOUNT}>`, // sender address
      to: to, // list of receivers
      subject: "Booking is pending payment...", // Subject line
      html:
        "<p>Hello, </p><p>Please pay the booking to confirm using one of following method</p>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (err) {
    console.error(err.message);
  }
}
