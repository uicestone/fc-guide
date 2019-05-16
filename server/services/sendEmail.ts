import nodemailer from "nodemailer";
import { IBooking } from "../models/booking";

export default async function sendEmail(
  to: string,
  title: string,
  content: string
) {
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
      subject: title, // Subject line
      html: content // html body
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

export function sendPaymentEmail(booking: IBooking) {
  sendEmail(
    booking.user.email,
    "Booking is pending payment...",
    `<p>Hello, </p><p>Your booking at\
     ${booking.date} (${booking.ampm}) \
     for ${booking.membersCount} person${
      booking.membersCount > 1 ? "s" : ""
    } is pending payment.</p>\
     <p>Please use one of following links to accomplish payment.</p>\
     <ul>\
       <li><a>Wechat Pay</a></li>\
       <li><a href="${process.env.APP_HOME}/#bookingId=${
      booking.id
    }">PayPal</a></li>\
     </ul>\
     <p>In case of any question, please email ${
       process.env.ADMIN_EMAIL
     }, thank you.</p>`
  );
}

export function sendConfirmEmail(booking: IBooking) {
  sendEmail(
    booking.user.email,
    "Booking is confirmed!",
    `<p>Hello, </p><p>Your booking at\
     ${booking.date} (${booking.ampm}) \
     for ${booking.membersCount} person${
      booking.membersCount > 1 ? "s" : ""
    } is confirmed. </p><p>Booking reference is <b>${booking.id.substr(
      -4
    )}</b>.</p>\
     <p>In case of any question, please email ${
       process.env.ADMIN_EMAIL
     }, thank you.</p>`
  );

  sendEmail(
    booking.user.email,
    `New booking received! (${booking.id.substr(-4)})`,
    `<p>Hello, </p><p>${booking.user.email} has paid for booking at\
     ${booking.date} (${booking.ampm}) \
     for ${booking.membersCount} person${
      booking.membersCount > 1 ? "s" : ""
    }. </p><p>Booking reference is <b>${booking.id.substr(-4)}</b>.</p>`
  );
}
