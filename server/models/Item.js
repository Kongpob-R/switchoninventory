const mongoose = require("mongoose");

const item = new mongoose.Schema(
	{
		name: String,
		categories: String,
		variation: String,
		modifier: String,
		quantity: String,
	},
	{
		timestamps: true,
	}
);

var Item = mongoose.model("Item", item);

module.exports = Item;
