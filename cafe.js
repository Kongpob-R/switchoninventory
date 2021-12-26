require("dotenv").config();

// Require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const { Client, Environment } = require("square");

// paperlessCafe app on Square
const clientSquare = new Client({
	environment: Environment.Production,
	accessToken: process.env.SQUARE_TOKEN,
});

// Axios
const axios = require("axios");

//Initialize express and define a port
var app = express();
const path = require("path");
const fs = require("fs");
const PORT = 4001;
app.use(bodyParser.json());

const options = {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		transports: ["websocket", "polling"],
		credentials: true,
	},
	allowEIO3: true,
};
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, options);
httpServer.listen(PORT, () =>
	console.log(`ðŸš Server running on port ${PORT}`)
);

const multer = require("multer");

const handleError = (err, res) => {
	console.log(err);
	res.status(500)
		.contentType("text/plain")
		.end("Oops! Something went wrong!");
};

app.get("/upload", express.static(path.join(__dirname, "./public_upload")));

const upload = multer({
	dest: "../temp",
});

app.get("/banner.png", (req, res) => {
	res.sendFile(path.join(__dirname, "../uploads/banner.png"));
});
app.get("/queuebanner.png", (req, res) => {
	res.sendFile(path.join(__dirname, "../uploads/queuebanner.png"));
});

app.post(
	"/upload/banner",
	upload.single("file" /* name attribute of <file> element in your form */),
	(req, res) => {
		const tempPath = req.file.path;
		const targetPath = path.join(__dirname, "../uploads/banner.png");
		if (path.extname(req.file.originalname).toLowerCase() === ".png") {
			fs.rename(tempPath, targetPath, (err) => {
				if (err) return handleError(err, res);
				res.status(200).contentType("text/plain").end("File uploaded!");
			});
			emitUpdatedFullBanner();
		} else {
			fs.unlink(tempPath, (err) => {
				if (err) return handleError(err, res);
				res.status(403)
					.contentType("text/plain")
					.end("Only .png files are allowed!");
			});
		}
	}
);

app.post(
	"/upload/queuebanner",
	upload.single("file" /* name attribute of <file> element in your form */),
	(req, res) => {
		const tempPath = req.file.path;
		const targetPath = path.join(__dirname, "../uploads/queuebanner.png");
		if (path.extname(req.file.originalname).toLowerCase() === ".png") {
			fs.rename(tempPath, targetPath, (err) => {
				if (err) return handleError(err, res);
				res.status(200).contentType("text/plain").end("File uploaded!");
			});
			emitUpdatedQueueBanner();
		} else {
			fs.unlink(tempPath, (err) => {
				if (err) return handleError(err, res);
				res.status(403)
					.contentType("text/plain")
					.end("Only .png files are allowed!");
			});
		}
	}
);

app.use(
	"/kitchenscreen",
	express.static(path.join(__dirname, "../switchonkitchenscreen/"))
);

// Initialize Mongoose Object
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;
mongoose.connect(
	dbUrl,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	(err) => {
		console.log("mongodb connected", err);
	}
);
const Order = require("./models/Order");

// Initialize MQTT
const mqtt = require("mqtt");

const host = process.env.HOST;
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
	clientId,
	clean: true,
	connectTimeout: 4000,
	username: "switchon",
	password: "switchon",
	reconnectPeriod: 1000,
});

const topic = "/mqtt/drawer";
client.on("connect", () => {
	console.log("Connected");
	client.subscribe([topic], () => {
		console.log(`Subscribe to topic '${topic}'`);
	});
	client.publish(topic, "stand by", { qos: 1, retain: false }, (error) => {
		if (error) {
			console.error(error);
		}
	});
});
client.on("message", (topic, payload) => {
	console.log("Received Message:", topic, payload.toString());
});

const stateCycle = (categories, state) => {
	if (categories == "drinks") {
		if (state == "wait") return "process";
		else if (state == "process") return "done";
		else if (state == "done") return "served";
		else return "served";
	} else if (state) {
		if (state == "wait") return "done";
		else if (state == "done") return "served";
		else return "served";
	} else {
		return "served";
	}
};

// handle Socket.io connection
io.on("connection", (socket) => {
	socket.on("orders", async () => {
		const orders = await Order.find().limit(12);
		socket.emit("orders", orders);
		console.log("client request all order");
	});
	socket.on("delete", async (id) => {
		Order.deleteOne({ _id: id });
		console.log("delete id", id);
		emitOrders();
	});
	socket.on("update_name", async (target) => {
		const order = await Order.findOneAndUpdate(
			{ _id: target.orderID },
			{ customer_name: target.customer_name },
			{ new: true }
		);
		emitUpdatedName();
	});
	socket.on("update_state", async (target) => {
		var order = await Order.findOne({ _id: target.orderID });
		const newItems = order.items.map((item) => {
			if (item._id == target.itemID) {
				item.state = stateCycle(item.categories, item.state);
			}
			console.log("update_state", item.name, item.state);
			if (item.state == "done") {
				io.emit("bell", "ring");
			}
			return item;
		});
		order.items = newItems;
		if (
			newItems.every((item) => {
				return item.state == "served";
			})
		) {
			await Order.deleteOne({ _id: target.orderID });
		} else {
			await order.save();
		}
		emitOrders();
	});
	socket.on("message", (message) => {
		console.log(message);
	});
});

const emitUpdatedName = async () => {
	const orders = await Order.find().limit(12);
	io.emit("updated_name", orders);
	console.log("emited updated name");
};

const emitOrders = async () => {
	const orders = await Order.find().limit(12);
	io.emit("orders", orders);
	console.log("emited orders");
};

const emitUpdatedFullBanner = async () => {
	io.emit("updated_full_banner");
	console.log("emited Updated Full Banner");
};

const emitUpdatedQueueBanner = async () => {
	io.emit("updated_queue_banner");
	console.log("emited Updated Queue Banner");
};

// handling OauthToken
var tokenExpiresAt = 0;
var refreshExpiresAt = 0;
var refreshToken;
var authToken = "";

const getAuthToken = async (requestUId) => {
	const res = await axios.post(
		"api-sandbox.partners.scb/partners/sandbox/v1/oauth/token",
		{
			applicationKey: applicationKey,
			applicationSecret: applicationSecret,
		},
		{
			headers: {
				"content-type": "application/json",
				requestUId: requestUId,
				resourceOwnerId: applicationKey,
			},
		}
	);
	console.log(`requestUid: ${requestUid} statusCode: ${res.statusCode}`);
	console.log(res.data);
};

const getQrcode = async (requestUId, amount) => {
	const res = await axios.post(
		"https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create",
		{
			qrType: "PP",
			ppType: "BILLERID",
			ppId: process.env.SCB_PPID,
			amount: amount,
			ref1: "REFERENCE1",
			ref2: "REFERENCE2",
			ref3: "XST",
		},
		{
			headers: {
				"content-type": "application/json",
				authorization: "Bearer " + authToken,
				requestUId: requestUId,
				resourceOwnerId: applicationKey,
			},
		}
	);
	console.log(`requestUid: ${requestUId} statusCode: ${res.statusCode}`);
	console.log(res.data);
};

const catalog = {
	"6SMXXP7WXY2IOGV3R3DWA7XY": "desserts",
};

// Start express on the defined port
app.post("/hook/payment-created", (req, res) => {
	// console.log(req.body) // Call your action on the request here
	res.status(200).end(); // Responding is important
	(async () => {
		try {
			// eject drawer if pay by cash
			const paymentMethod = req.body.data.object.payment.source_type;
			const amount =
				"" + req.body.data.object.payment.amount_money.amount / 100;
			console.log("payment method: ", paymentMethod);
			if (paymentMethod === "CASH") {
				io.emit("drawer", "kick");
				client.publish(
					"/mqtt/drawer",
					"kick",
					{ qos: 1, retain: false },
					(error) => {
						if (error) {
							console.error(error);
						}
					}
				);
				console.log("emit kick drawer");
			}

			// fetch orders details with payment
			const response = await clientSquare.ordersApi.retrieveOrder(
				req.body.data.object.payment.order_id
			);
			console.log(
				"retriving orderID: ",
				req.body.data.object.payment.order_id
			);
			console.log(
				"catalogObjectId of first item: ",
				response.result.order.lineItems[0].catalogObjectId
			);
			console.log(
				"variation of first item: ",
				response.result.order.lineItems[0].variationName
			);
			client.publish(
				"/mqtt/drawer",
				"stand by",
				{ qos: 1, retain: false },
				(error) => {
					if (error) {
						console.error(error);
					}
				}
			);

			// create orders object
			var previousCatalog = "drinks";
			const lineItems = response.result.order.lineItems.map((item) => {
				var modifiers = "";
				previousCatalog = catalog[item.catalogObjectId]
					? catalog[item.catalogObjectId]
					: previousCatalog;
				if (item.modifiers) {
					item.modifiers.map((modifier) => {
						modifiers +=
							modifiers === ""
								? modifier.name
								: ", " + modifier.name;
					});
				}
				return {
					name: item.name,
					categories: previousCatalog,
					variation: item.variationName,
					modifier: modifiers,
					quantity: item.quantity,
					state: "wait",
				};
			});
			const newOrder = Order(
				{
					is_paid: paymentMethod === "CASH" ? true : false,
					items: lineItems,
				},
				(err) => {
					if (err) console.log(err);
				}
			);
			await newOrder.save();

			emitOrders();

			// if pay by others generate QR code payment
			// await getAuthToken(newOrder['_id'] + '')
			await getQrcode(newOrder["_id"] + "", amount);
		} catch (error) {
			console.log(error);
		}
	})();
});

app.post("/hook/scb/payment-confirm", (req, res) => {
	console.log(req.body); // Call your action on the request here
	res.status(200).end(); // Responding is important
});

app.post("/hook/scb", (req, res) => {
	console.log(req.body); // Call your action on the request here
	res.status(200).end(); // Responding is important
});
