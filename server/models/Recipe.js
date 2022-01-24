const mongoose = require("mongoose");

const recipe = new mongoose.Schema({
	name: String,
	categories: String,
	variation: String,
	modifier: String,
	ingredients: [
		{
			name: String,
			qty: Number,
		},
	],
});

var Recipe = mongoose.model("Recipe", recipe);

module.exports = Recipe;
