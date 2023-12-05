import axios from "axios";
import { Version,PhoneNumberID ,accessToken } from "../../config";

export const sendOTPWhatsapp = async (otp: string, phoneNumber: string) => {
const phoneNumberWithoutPlus = phoneNumber.slice(1)
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumberWithoutPlus,
    type: "template",
    template: {
      name: "otp",
      language: {
        code: "en_US",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
    },
  };


  try{
  const sendTowhastapp = await axios.post(
    `https://graph.facebook.com/${Version}/${PhoneNumberID}/messages`,
    data,{
        headers :{
            Authorization : `Bearer ${accessToken}`
        }
    }
  );


}catch(err:any){
    throw new Error(`Failed to send otp , ${err.message}`)
}
};
