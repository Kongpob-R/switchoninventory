const mongoose = require("mongoose");

const ingredient = new mongoose.Schema({
	name: String,
	catagory: String,
	cost: Number,
	qty: Number,
	qtyName: String,
	qtyPerUnit: Number,
	vendor_id: String,
});

var Ingredient = mongoose.model("Ingredient", ingredient);

module.exports = Ingredient;
