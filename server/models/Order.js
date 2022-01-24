const mongoose = require("mongoose");

const order = new mongoose.Schema({
	customer_name: String,
	is_paid: Boolean,
	items: [
		{
			name: String,
			categories: String,
			variation: String,
			modifier: String,
			quantity: String,
			state: String,
		},
	],
});

var Order = mongoose.model("Order", order);

module.exports = Order;
