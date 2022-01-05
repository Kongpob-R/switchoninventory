const mongoose = require("mongoose");

const ingredient = new mongoose.Schema({
	name: String,
	cost: Number,
	qty: Number,
	qtyName: String,
	qtyPerUnit: Number,
});

var Ingredient = mongoose.model("Ingredient", ingredient);

module.exports = Ingredient;
