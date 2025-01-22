import twilio from 'twilio';

const accountSid = process.env.SMS_ACCOUNT_SID
const authToken = process.env.SMS_AUTH_TOKEN
const client = twilio(accountSid, authToken);


export const sendPasswordOnMobile = async (mobile: string, text: string) => {
    try {
        const message = await client.messages.create({
            body: `You password is: ${text}`,
            from: "+16203203048",
            to: mobile
        });
        return message;
    } catch (error) {
        throw error;
    }
}
