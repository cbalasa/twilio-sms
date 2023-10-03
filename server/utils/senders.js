const fs = require("fs");
const path = require("path");
const smsSendersPath = path.join(process.cwd(), "smsSenders.json");
const currentDate = new Date().toISOString().substring(0, 10);
const currentTimeStamp = new Date().getTime();
const oneHour = 60 * 60 * 1000; /* ms */
const oneDay = 60 * 60 * 24 * 1000; /* ms */
const maxNumberSmsPerHour = 3;
const maxNumberSmsPerDay = 10;
const updateCreateSender = ({ phoneNumber }) => {
	let smsSenders = getSendersJsons();

	if (Object.keys(smsSenders).length) {
		let currentSender = smsSenders?.[phoneNumber];
		if (currentSender?.[currentDate]) {
			currentSender[currentDate] = [
				...currentSender[currentDate],
				currentTimeStamp
			];
		} else {
			if (smsSenders?.[phoneNumber]) {
				smsSenders[phoneNumber][currentDate] = [currentTimeStamp];
			} else {
				smsSenders[phoneNumber] = {};
				smsSenders[phoneNumber][currentDate] = [currentTimeStamp];
			}
		}
		fs.writeFileSync(smsSendersPath, JSON.stringify(smsSenders));
	} else {
		const sender = {
			[phoneNumber]: {
				[currentDate]: [currentTimeStamp]
			}
		};
		smsSenders = sender;
	}
	fs.writeFileSync(smsSendersPath, JSON.stringify(smsSenders));
};

const getSendersJsons = () => {
	if (!fs.existsSync(smsSendersPath)) {
		fs.writeFileSync(smsSendersPath, "{}");
	}
	const smsSenders = JSON.parse(fs.readFileSync(smsSendersPath));

	return smsSenders;
};

const validateSender = ({ phoneNumber }) => {
	const smsSenders = getSendersJsons();
	const currentSender = smsSenders?.[phoneNumber]?.[currentDate];
	let validatedSender = {
		isValid: true,
		message: ""
	};

	if (currentSender) {
		if (currentSender.length >= maxNumberSmsPerHour) {
			const numberOfLastTimestamps = maxNumberSmsPerHour;
			if (checkIfSenderIsValid({ numberOfLastTimestamps, currentSender })) {
				validatedSender = createValidatedSender({
					numberOfLastTimestamps,
					currentSender
				});
			}
		}
		if (currentSender.length >= maxNumberSmsPerDay) {
			const numberOfLastTimestamps = maxNumberSmsPerDay;
			if (checkIfSenderIsValid({ numberOfLastTimestamps, currentSender })) {
				validatedSender = createValidatedSender({
					numberOfLastTimestamps,
					currentSender
				});
			}
		}
	}
	return validatedSender;
};

const nextHour = ({ currentSender }) => {
	const nextHour = new Date(currentSender.slice(-1)[0] + oneHour);
	const hour = nextHour.getHours();
	const minutes = nextHour.getMinutes();
	return `${hour}:${minutes}`;
};

const checkIfSenderIsValid = ({ numberOfLastTimestamps, currentSender }) => {
	const lastXAttemtps = currentSender.slice(-numberOfLastTimestamps);
	const timeStampToCheck =
		numberOfLastTimestamps === maxNumberSmsPerDay ? oneDay : oneHour;
	return (
		lastXAttemtps.filter(
			(timestamp) => currentTimeStamp - timestamp < timeStampToCheck
		).length == numberOfLastTimestamps
	);
};

const createValidatedSender = ({ numberOfLastTimestamps, currentSender }) => {
	return {
		isValid: false,
		message: createValidatedSenderMessages({
			currentSender,
			numberOfLastTimestamps
		})
	};
};

const createValidatedSenderMessages = ({
	currentSender,
	numberOfLastTimestamps
}) => {
	return numberOfLastTimestamps === maxNumberSmsPerHour
		? `You can send only 3 sms in on hour. Try again at ${nextHour({
				currentSender
		  })}`
		: `You can send only 10 sms per day. Try again tomorrow`;
};

module.exports = { validateSender, updateCreateSender, nextHour };
