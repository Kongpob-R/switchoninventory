const mongoose = require("mongoose");

const vendor = new mongoose.Schema({
	name: String,
	billerId: String,
	address: String,
	subDistrict: String,
	district: String,
	province: String,
	zipcode: String,
});

var Vendor = mongoose.model("Vendor", vendor);

module.exports = Vendor;
