import UserModel from "../models/user";
import { mailConfigurations } from "../types/mailer";
import { PPABuy } from "../types/ppa";

const nodemailer = require("nodemailer");

const ppaAckHtml = (powerplant: any, ppaBuy : PPABuy) => {
  return `
    <center>
        <h2>Congratulations!</h2>
        <img src="cid:checkmark" style="width:48px;height:48px;" alt="Checkmark">
        <h5> You have successfully concluded a PPA with ${powerplant.name}</h5>
        <h5>Your PPA's Properties</h5>
        <table>
            <tr>
                <td>Powerplant</td>
                <td>${powerplant.name}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>${powerplant.price} cents/kWh</td>
            </tr>
            <tr>
                <td>Duration</td>
                <td>${ppaBuy.duration} years</td>
            </tr>
            <tr>
                <td>Amount per year</td>
                <td>${ppaBuy.amount} kWh</td>
            </tr>
        </table>
        <br>Do you have any questions? 
        <br>Do not hesitate to contact the greenmatch team via <a href = "mailto: ppa.greenmatch@oulook.com">ppa.greenmatch@oulook.com</a>
    </center>`;
};

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
  buyerId: string,
  powerplant: any,
  ppaBuy: PPABuy
) => {
  // resolve mailadress from buyerid
  const buyer = await UserModel.findOne({ _id: buyerId }).lean();

  if (!buyer) {
    return "Could not send E-mail because of missing E-Mail";
  }

  // ToDo Set Username to email prop after branch merges
  const ackMail: mailConfigurations = {
    to: buyer.email,
    subject: `GreenMatch - Successfully PPA Conclusion with ${powerplant.name}`,
    html: ppaAckHtml(powerplant, ppaBuy),
    attachments: [
      {
        filename: "checkmark.png",
        path: __dirname + "/../assets/mailer/checkmark.png",
        cid: "checkmark",
      },
    ],
  };
  await sendMail(ackMail);
};
