const mongoose = require("mongoose");

const vendor = new mongoose.Schema({
	name: String,
	billerId: String,
	address: String,
	ingredients: [
		{
			ingredient_id: String,
		},
	],
});

var Vendor = mongoose.model("Vendor", vendor);

module.exports = Vendor;
