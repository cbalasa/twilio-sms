const { validateSender, updateCreateSender } = require("../utils/senders");
let dotenv = require("dotenv").config();

const accountSid = dotenv.parsed.ACCOUNT_SID;
const authToken = dotenv.parsed.AUTH_TOKEN;
const twilio = require("twilio");

const client = twilio(accountSid, authToken);

const sendSms = async (req, res) => {
	try {
		const { phoneNumber } = req.body;
		const validatedSender = validateSender({ phoneNumber });
		if (!validatedSender.isValid) {
			return res.status(403).send({
				type: "danger",
				message: validatedSender.message
			});
		}

		await client.messages.create({
			body: "Omniconvert is awesome! :)",
			to: phoneNumber,
			from: dotenv.parsed.TWILIO_PHONE_NUMBER
		});
		updateCreateSender({ phoneNumber });
		res.send({
			type: "success",
			message: `The SMS was sent to ${phoneNumber}`
		});
	} catch (error) {
		console.error(error);
		const err = new Error();
		err.type = "danger";
		err.message = "Please try again later";

		res.status(403).send(err);
	}
};

module.exports = { sendSms };
