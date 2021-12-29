const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Please enter an email"],
		unique: true,
		lowercase: true,
		validate: [isEmail, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [8, "Minimum password length is 8 characters"],
	},
});

userSchema.pre("save", function (next) {
	var user = this;
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

var User = mongoose.model("User", userSchema);

module.exports = User;
