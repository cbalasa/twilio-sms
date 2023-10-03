const displaySuccessMessage = ({ message }) => {
	const validMsg = document.querySelector("#valid-msg");
	validMsg.innerHTML = message;
	validMsg.classList.remove("invisible");
};

const hideSuccessMessage = () => {
	const validMsg = document.querySelector("#valid-msg");
	validMsg.innerHTML = "";
	validMsg.classList.add("invisible");
};

const displayErrorMessage = ({ message }) => {
	const errorMsg = document.querySelector("#error-msg");
	errorMsg.innerHTML = message;
	errorMsg.classList.remove("invisible");
};

const hideErrorMessage = () => {
	const errorMsg = document.querySelector("#error-msg");
	errorMsg.innerHTML = "";
	errorMsg.classList.add("invisible");
};

const submit = async (e) => {
	e.preventDefault();
	const data = new FormData();
	data.append("phoneNumber", iti.getNumber());
	try {
		if (validateNumber()) {
			const sendSms = await $.ajax({
				url: `http://localhost:3002/send-sms`,
				method: "POST",
				processData: false,
				contentType: false,
				data: data
			});
			hideErrorMessage();
			displaySuccessMessage({ message: sendSms.message });

			input.value = "";
		}
	} catch (error) {
		hideSuccessMessage();
		displayErrorMessage({ message: error.responseJSON.message });
	}
};

const resetMessages = () => {
	hideSuccessMessage();
	hideErrorMessage();
};

const validateNumber = () => {
	resetMessages();
	let isValid = false;
	if (iti.isValidNumber()) {
		isValid = true;
	} else {
		hideSuccessMessage();
		displayErrorMessage({ message: "Insert a correct phone number" });
	}
	return isValid;
};
