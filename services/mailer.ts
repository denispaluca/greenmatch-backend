import { mailConfigurations } from "../types/mailer";

const nodemailer = require("nodemailer");

const ppaAckHtml = "";

export const sendMail = async (mailData: mailConfigurations) => {
  const email = {
    from: "ppa.greenmatch@outlook.de",
    ...mailData,
  };

  console.log("Email Data Conf", email);

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "ppa.greenmatch@outlook.de",
      pass: "fhckwtkjwdjdwbeg",
    },
  });

  transporter.sendMail(email, function (error: any, info: any) {
    if (error) throw Error(error);
    console.log("Email Sent Successfully");
    console.log(info);
  });
};

export const sendPpaAcknowledgement = async (
  dstMailAdress: string,
  powerPlantName: string
) => {
  const ackMail: mailConfigurations = {
    to: dstMailAdress,
    subject: `GreenMatch - Successfully PPA Conclusion with ${powerPlantName}`,
    html:
      `<center> <h2>Congratulations!</h2><img src="cid:checkmark" style="width:48px;height:48px;" alt="Checkmark"><h5> You have successfully concluded a PPA with ${powerPlantName}</h5>` +
      `<br>Do you have any questions? <br>Do not hesitate to contact the greenmatch team via <a href = "mailto: ppa.greenmatch@oulook.com">ppa.greenmatch@oulook.com</a><center>`,
    attachments: [
      {
        filename: "checkmark.png",
        path: __dirname + "/../assets/mailer/checkmark.png",
        cid: "checkmark",
      },
    ],
  };

  console.log("Dirname", __dirname);
  await sendMail(ackMail);
};
