const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
let dotenv = require("dotenv").config();
const routesSendSms = require("./routes/sms/sendSms");

const port = dotenv.parsed.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
	cors({
		origin: "*"
	})
);

app.use("/", routesSendSms);

app.listen(port, () => {
	console.log(`Twilio app listening on port ${port}`);
});
