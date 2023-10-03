const express = require("express"); //import express

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { sendSms } = require("../../controllers/sendSms");

router.post("/send-sms", upload.none(), sendSms);

module.exports = router;
