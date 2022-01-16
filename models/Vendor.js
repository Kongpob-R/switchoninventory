const mongoose = require("mongoose");

const vendor = new mongoose.Schema({
	name: String,
	billerId: String,
	address: String,
});

var Vendor = mongoose.model("Vendor", vendor);

module.exports = Vendor;
