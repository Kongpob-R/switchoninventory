const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("dotenv").config();

let resKeyword = "request to send location of ";

var index = "";
app.post("/webhook", (req, res) => {
	let reply_token = req.body.events[0].replyToken;
	let msg = req.body.events[0];
	var mainMsg = msg.message.text;
	if (mainMsg == undefined) {
		mainMsg = "";
	}
	if (msg.message.type == "location" && index != "") {
		shortReply(reply_token, `location is save! ${index}`);
	} else if (mainMsg.includes(resKeyword)) {
		index = mainMsg.substring(resKeyword.length);
		let body = JSON.stringify({
			replyToken: reply_token,
			messages: [
				{
					type: "text",
					text: `Please send me your location!, I will save if for ${index}`,
					quickReply: {
						items: [
							{
								type: "action",
								action: {
									type: "location",
									label: "Send Location",
								},
							},
						],
					},
				},
			],
		});
		reply(body);
	} else {
		index = "";
		shortReply(reply_token, JSON.stringify(msg));
	}
	res.sendStatus(200);
});

app.get("/sample", (req, res) => {
	let body = JSON.stringify({
		messages: [
			{
				type: "template",
				altText: "this is a buttons template",
				template: {
					type: "buttons",
					actions: [
						{
							type: "message",
							label: "share location No.1",
							text: resKeyword + "No.1",
						},
						{
							type: "message",
							label: "share location No.2",
							text: resKeyword + "No.2",
						},
						{
							type: "message",
							label: "share location No.3",
							text: resKeyword + "No.3",
						},
					],
					title: "POS12345",
					text: "ต้องการที่อยู่ลูกค้า",
				},
			},
		],
	});
	boardcastLocationForm(body);
	res.sendStatus(200);
});

app.listen(port);

const LINE_HEADER = {
	"Content-Type": "application/json",
	Authorization: process.env.LINE_AUTH,
};

function boardcastLocationForm(body) {
	request.post(
		{
			url: "https://api.line.me/v2/bot/message/broadcast",
			headers: LINE_HEADER,
			body: body,
		},
		(err, res, body) => {
			console.log("status = " + res.statusCode);
		}
	);
}

function reply(body) {
	request.post(
		{
			url: "https://api.line.me/v2/bot/message/reply",
			headers: LINE_HEADER,
			body: body,
		},
		(err, res, body) => {
			console.log("status = " + res.statusCode);
		}
	);
}

function shortReply(reply_token, msg) {
	let body = JSON.stringify({
		replyToken: reply_token,
		messages: [
			{
				type: "text",
				text: msg,
			},
		],
	});
	request.post(
		{
			url: "https://api.line.me/v2/bot/message/reply",
			headers: LINE_HEADER,
			body: body,
		},
		(err, res, body) => {
			console.log("status = " + res.statusCode);
		}
	);
}
